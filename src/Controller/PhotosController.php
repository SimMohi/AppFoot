<?php


namespace App\Controller;


use App\Entity\Photos;
use App\Entity\PhotosFolder;
use App\Entity\TeamPhotos;
use App\Entity\TeamRonvau;
use App\Entity\User;
use App\Entity\UserTeam;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class PhotosController extends AbstractController
{

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/createFolder")
     */
    public function createFolder(Request $request)
    {
        $data = $request->getContent();
        $data = json_decode($data, true);

        $folder = new PhotosFolder();
        $folder->setName($data["name"]);

        $this->getDoctrine()->getManager()->persist($folder);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");
    }


    /**
     * @return JsonResponse
     * @Route ("/getAllPhotos")
     */
    public function getAllPhotos()
    {
        $return=[];
        $folders = $this->getDoctrine()->getRepository(PhotosFolder::class)->findAll();
        foreach ($folders as $folder){
            $fold = [];
            $fold["id"] = $folder->getId();
            $fold["name"] = $folder->getName();
            $photos = $folder->getPhotos();
            $fold["count"] = count($photos);
            $return[] = $fold;
        }
        return $this->json($return);
    }

    /**
     * @param int $id
     * @return JsonResponse
     * @Route ("/getFolderPhotos/{id}")
     */
    public function getFolderPhotos(int $id)
    {
        $return=[];
        $photosF = $this->getDoctrine()->getRepository(PhotosFolder::class)->findOneBy(["id" => $id]);
        $photos = $photosF->getPhotos();

        $return["name"] =  $photosF->getName();
        $return["photos"] = [];
        foreach ($photos as $photo){
            $phot = [];
            $phot["id"] = $photo->getId();
            $phot["path"] = $photo->getPath();
            $return["photos"][] = $phot;
        }
        return $this->json($return);

    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @Route ("/addPhotos")
     */
    public function addPhotos(Request $request)
    {
        $photos = $this->getDoctrine()->getRepository(Photos::class)->findAll();
        $num = count($photos);

        $numSend = intval($_POST["num"]);

        $folder = $this->getDoctrine()->getRepository(PhotosFolder::class)->findOneBy(["id" => $_POST["id"]]);

        for ($i=0; $i < $numSend; $i++){
            $file_name = $_FILES["image$i"]['name'];
            $file_extention = strrchr($file_name, ".");

            $file_tmp_name = $_FILES["image$i"]["tmp_name"];
            $numP = $num+1+$i;
            $file_dest = "photos/"."image$numP".$file_extention;
            if (move_uploaded_file($file_tmp_name, $file_dest)){
            } else {
                return $this->json("erreur");
            }

            $photo = new Photos();
            $photo->setPath($file_dest);
            $photo->setFolder($folder);
            $this->getDoctrine()->getManager()->persist($photo);
        }

        $this->getDoctrine()->getManager()->flush();


        return $this->json($_POST);

    }

    /**
     * @param int $id
     * @return JsonResponse
     * @Route ("/removePhoto/{id}")
     */
    public function removePhoto(int $id)
    {
        $photos = $this->getDoctrine()->getRepository(Photos::class)->findOneBy(["id" => $id]);

        $this->getDoctrine()->getManager()->remove($photos);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");

    }

    /**
     * @param int $id
     * @return JsonResponse
     * @Route ("/removeFolder/{id}")
     */
    public function removeFolder(int $id)
    {
        $folder = $this->getDoctrine()->getRepository(PhotosFolder::class)->findOneBy(["id" => $id]);

        $this->getDoctrine()->getManager()->remove($folder);
        $this->getDoctrine()->getManager()->flush();

        return $this->json("ok");

    }

    /**
     * @return JsonResponse
     * @Route ("/getAllowPhotos")
     */
    public function getAllowPhotos(){
        $users = $this->getDoctrine()->getRepository(User::class)->findAll();

        $teamRonvaus = $this->getDoctrine()->getRepository(TeamRonvau::class)->findAll();
        $return = [];

        foreach ($teamRonvaus as $teamRonvau){
            $arr["name"] = $teamRonvau->getCategory();
            $arr["id"] = $teamRonvau->getId();
            $return["team"][] = $arr;
        }
        foreach ($users as $user){
            $arr["name"] = $user->getLastName(). " " . $user->getFirstName();
            $arr["accept"] = $user->getRgdpPhotos();
            $arr["path"] = $user->getProfilePic();
            $return["user"][] = $arr;
        }

        return $this->json($return);

    }

    /**
     * @param int $id
     * @return JsonResponse
     * @Route ("/getAllowPhotosT/{id}")
     */
    public function getAllowPhotosT(int $id){
        $userTeams = $this->getDoctrine()->getRepository(UserTeam::class)->findBy(["teamRonvauId"=>$id]);

        $return = [];
        foreach ($userTeams as $userTeam){
            $arr["name"] = $userTeam->getUserId()->getLastName(). " " . $userTeam->getUserId()->getFirstName();
            $arr["accept"] = $userTeam->getUserId()->getRgdpPhotos();
            $arr["path"] = $userTeam->getUserId()->getProfilePic();

            $return[] = $arr;
        }

        return $this->json($return);

    }
}