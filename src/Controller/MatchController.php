<?php


namespace App\Controller;


use App\Entity\Club;
use App\Entity\Competition;
use App\Entity\Matche;
use App\Entity\PlayerMatch;
use App\Entity\Team;
use App\Entity\TeamRonvau;
use App\Entity\UnOfficialMatch;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class MatchController extends AbstractController
{

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/postCallMatch")
     * @throws \Exception
     */
    public function postCallMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $users = $data["call"];
        $appointment = new \DateTime($data["appointment"]);
        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $data["match"]]);
        $match->setAppointmentHour($appointment);
        $response = array();
        foreach ($users as $user) {
            if ($user["called"] == false) continue;
            $matchPlayer = new PlayerMatch();
            $userTeam = $this->getDoctrine()->getRepository(UserTeam::class)->findOneBy(['id' => $user["id"]]);
            $matchPlayer->setIdUserTeam($userTeam);

            $matchPlayer->setIdMatch($match);

            $this->getDoctrine()->getManager()->persist($matchPlayer);
            $response[] = $matchPlayer->getId();
        }
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

        return $this->json($response);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/postEncodeMatch")
     */
    public function postEncodeMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $users = $data["player"];
        $response = array();
        foreach ($users as $user) {
            $matchPlayer = $this->getDoctrine()->getRepository(PlayerMatch::class)->findOneBy(['id' => $user["id"]]);

            if (isset($user["played"])) {
                $matchPlayer->setPlayed($user["played"]);
            }

            if (isset($user["goal"])) {
                $matchPlayer->setGoal($user["goal"]);
            }

            if (isset($user["redCard"])) {
                $matchPlayer->setRedCard($user["redCard"]);
            }

            if (isset($user["yellowCard"])) {
                $matchPlayer->setYellowCard($user["yellowCard"]);
            }
            $match = $matchPlayer->getIdMatch();

            $this->getDoctrine()->getManager()->persist($matchPlayer);
            $response[] = $matchPlayer->getId();
        }
        if ($match !== null){
            $match->setIsOver(true);
            $match->setHomeTeamGoal($data["goalA"]);
            $match->setVisitorTeamGoal($data["goalB"]);
            $this->getDoctrine()->getManager()->persist($match);
        }
        $this->getDoctrine()->getManager()->flush();

        return $this->json($response);
    }


    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/editDateMatch")
     * @throws \Exception
     */
    public function editDateMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $date = new \DateTime($data["date"]);
        $start = explode(":", $data["hour"]);
        $date->setTime($start[0], $start[1], 0);

        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $data["id"]]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("La date a bien été modifiée");
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/editDateUnOffMatch")
     * @throws \Exception
     */
    public function editDateUnOffMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        $date = new \DateTime($data["date"]);
        $start = explode(":", $data["hour"]);
        $date->setTime($start[0], $start[1], 0);

        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(['id' => $data["id"]]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("La date a bien été modifiée");
    }


    /**
     * @param int $competId
     * @return JsonResponse
     * @Route ("/getMatchCompet/{competId}")
     */
    public function getMatchCompet(int $competId)
    {
        $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $competId]);
        $teams = $competition->getTeams();

        $response = array();
        $response["name"] = $competition->getName();
        $response["team"] = [];
        foreach ($teams as $team) {
            $matchAs = $team->getMatchA();
            foreach ($matchAs as $matchA) {
                $response["team"][$matchA->getMatchDay()][] = $matchA;
            }
        }

        return $this->json($response);
    }

    /**
     * @param int $matchId
     * @return JsonResponse
     * @Route ("/getMatchDetails/{matchId}")
     */
    public function getMatchDetails(int $matchId)
    {
        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $matchId]);
        $players = $match->getPlayerMatches();
        $return = array();
        foreach ($players as $player) {
            $playerArr = array();
            if ($player->getPlayed()) {
                $playerArr["name"] = $player->getIdUserTeam()->getUserId()->getLastName() . " " . $player->getIdUserTeam()->getUserId()->getFirstName();
                $playerArr["yellow"] = $player->getYellowCard();
                $playerArr["red"] = $player->getRedCard();
                $playerArr["goal"] = $player->getGoal();
                $return[] = $playerArr;
            }
        }

        return $this->json($return);
    }


    /**
     * @Route("/calledPlayerMatch/{id}")
     * @param int $id
     * @return JsonResponse
     */
    public function calledPlayerMatch(int $id)
    {
        $response = [];
        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(["id" => $id]);
        $called = $match->getPlayerMatches();

        foreach ($called as $call){
            $response[] = $call->getIdUserTeam()->getUserId()->getFirstName() . " " . $call->getIdUserTeam()->getUserId()->getLastName();
        }
        return $this->json($response);
    }

    /**
     * @param int $teamId
     * @return JsonResponse
     * @Route ("/getUnOfMatchCompet/{teamId}")
     */
    public function getUnOfMatchCompet(int $teamId)
    {
        $teamR = $this->getDoctrine()->getRepository(TeamRonvau::class)->findOneBy(['id' => $teamId]);
        $unOffMatchs = $teamR->getUnOfficialMatches();

        $response = array();
        $response["name"] = $teamR->getCategory();
        foreach ($unOffMatchs as $unOffMatch) {
            $matchArr = array();
            $matchArr["id"] = $unOffMatch->getId();
            if ($unOffMatch->getIsHome()) {
                $matchArr["teamA"] = $unOffMatch->getTeamRonvau()->getTeam()->getClub()->getName();
                $matchArr["teamB"] = $unOffMatch->getOpponent()->getName();
                $matchArr["teamAGoal"] = $unOffMatch->getRonvauTeamGoal();
                $matchArr["teamBGoal"] = $unOffMatch->getOpponentGoal();

            } else {
                $matchArr["teamA"] = $unOffMatch->getOpponent()->getName();
                $matchArr["teamB"] = $unOffMatch->getTeamRonvau()->getCategory();
                $matchArr["teamAGoal"] = $unOffMatch->getOpponentGoal();
                $matchArr["teamBGoal"] = $unOffMatch->getRonvauTeamGoal();
            }
            $matchArr["date"] = $unOffMatch->getDate();
            $matchArr["isOver"] = $unOffMatch->getIsOver();
            $response["matchs"][] = $matchArr;
        }

        return $this->json($response);
    }

    /**
     * @param int $matchId
     * @return JsonResponse
     * @Route ("/getUnOfMatchDetails/{matchId}")
     */
    public function getUnOfMatchDetails(int $matchId)
    {
        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(['id' => $matchId]);
        $players = $match->getPlayerUnofficialMatches();
        $return = array();
        foreach ($players as $player) {
            $playerArr = array();
            if ($player->getPlayed()) {
                $playerArr["name"] = $player->getUserTeam()->getUserId()->getLastName() . " " . $player->getUserTeam()->getUserId()->getFirstName();
                $playerArr["yellow"] = $player->getYellowCard();
                $playerArr["red"] = $player->getRedCard();
                $playerArr["goal"] = $player->getGoal();
                $return[] = $playerArr;
            }
        }

        return $this->json($return);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/scoreMatch")
     */
    public function scoreMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);
        foreach ($data as $m){
            $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $m["id"]]);
            if ($m["homeTeamGoal"] == "" || $m["visitorTeamGoal"] == "") continue;
            $match->setHomeTeamGoal($m["homeTeamGoal"]);
            $match->setVisitorTeamGoal($m["visitorTeamGoal"]);
            $match->setIsOver(true);
            $this->getDoctrine()->getManager()->persist($match);
        }
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/newMatch")
     * @throws \Exception
     */
    public function newMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $competition = $this->getDoctrine()->getRepository(Competition::class)->findOneBy(['id' => $data["idCompet"]]);

        $clubA = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['id' => $data["a"]]);
        $clubB = $this->getDoctrine()->getRepository(Club::class)->findOneBy(['id' => $data["b"]]);

        $teamA = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['club' => $clubA, 'competition' => $competition]);
        $teamB = $this->getDoctrine()->getRepository(Team::class)->findOneBy(['club' => $clubB, 'competition' => $competition]);


        $match = new Matche();
        $match->setHomeTeam($teamA);
        $match->setVisitorTeam($teamB);
        $match->setMatchDay($data["matchDay"]);
        $date = new \DateTime($data["date"]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);


        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/newDateMatch")
     */
    public function newDateMatch(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $match = $this->getDoctrine()->getRepository(UnOfficialMatch::class)->findOneBy(['id' => $data["id"]]);

        $date = new \DateTime($data["date"]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/newDateMatchOff")
     */
    public function newDateMatchOff(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $data["id"]]);

        $date = new \DateTime($data["date"]);
        $match->setDate($date);
        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/editScore")
     */
    public function editScore(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $match = $this->getDoctrine()->getRepository(Matche::class)->findOneBy(['id' => $data["id"]]);

        $match->setHomeTeamGoal($data["goalA"]);
        $match->setVisitorTeamGoal($data["goalB"]);

        $this->getDoctrine()->getManager()->persist($match);
        $this->getDoctrine()->getManager()->flush();
        return $this->json("ok");

    }
}