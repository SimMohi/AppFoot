<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Validator\Constraints as Assert; // Symfony's built-in constraints
Use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass="App\Repository\TeamRonvauRepository")
 * @ApiResource(
 *      normalizationContext={"groups"={"team_ronvau_read"}},
 * )
 */
class TeamRonvau
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"team_ronvau_read", "matchs_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="La catégorie est obligatoire")
     * @Assert\Length(min=2, minMessage="La catégorie doit faire entre 2 et 255 caractères", max=255, maxMessage="La catégorie doit faire entre 2 et 255 caractères")
     * @Groups({"team_ronvau_read"})
     */
    private $category;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"team_ronvau_read"})
     */
    private $coach;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"team_ronvau_read"})
     */
    private $coachPhone;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTeam", mappedBy="teamRonvauId")
     * @Groups({"team_ronvau_read", "matchs_read"})
     */
    private $userTeams;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Training", mappedBy="teamRonvau", orphanRemoval=true)
     */
    private $trainings;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\EventsTeam", mappedBy="idTeamRonvau")
     */
    private $eventsTeams;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\Team", inversedBy="teamRonvau", cascade={"persist", "remove"})
     * @Groups({"team_ronvau_read"})
     */
    private $team;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\TrainingDay", mappedBy="teamRonvau")
     */
    private $trainingDays;

    public function __construct()
    {
        $this->userTeams = new ArrayCollection();
        $this->trainings = new ArrayCollection();
        $this->eventsTeams = new ArrayCollection();
        $this->trainingDays = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getCoach(): ?string
    {
        return $this->coach;
    }

    public function setCoach(?string $coach): self
    {
        $this->coach = $coach;

        return $this;
    }

    public function getCoachPhone(): ?string
    {
        return $this->coachPhone;
    }

    public function setCoachPhone(?string $coachPhone): self
    {
        $this->coachPhone = $coachPhone;

        return $this;
    }

    /**
     * @return Collection|UserTeam[]
     */
    public function getUserTeams(): Collection
    {
        return $this->userTeams;
    }

    public function addUserTeam(UserTeam $userTeam): self
    {
        if (!$this->userTeams->contains($userTeam)) {
            $this->userTeams[] = $userTeam;
            $userTeam->setTeamRonvauId($this);
        }

        return $this;
    }

    public function removeUserTeam(UserTeam $userTeam): self
    {
        if ($this->userTeams->contains($userTeam)) {
            $this->userTeams->removeElement($userTeam);
            // set the owning side to null (unless already changed)
            if ($userTeam->getTeamRonvauId() === $this) {
                $userTeam->setTeamRonvauId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Training[]
     */
    public function getTrainings(): Collection
    {
        return $this->trainings;
    }

    public function addTraining(Training $training): self
    {
        if (!$this->trainings->contains($training)) {
            $this->trainings[] = $training;
            $training->setTeamRonvau($this);
        }

        return $this;
    }

    public function removeTraining(Training $training): self
    {
        if ($this->trainings->contains($training)) {
            $this->trainings->removeElement($training);
            // set the owning side to null (unless already changed)
            if ($training->getTeamRonvau() === $this) {
                $training->setTeamRonvau(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|EventsTeam[]
     */
    public function getEventsTeams(): Collection
    {
        return $this->eventsTeams;
    }

    public function addEventsTeam(EventsTeam $eventsTeam): self
    {
        if (!$this->eventsTeams->contains($eventsTeam)) {
            $this->eventsTeams[] = $eventsTeam;
            $eventsTeam->setIdTeamRonvau($this);
        }

        return $this;
    }

    public function removeEventsTeam(EventsTeam $eventsTeam): self
    {
        if ($this->eventsTeams->contains($eventsTeam)) {
            $this->eventsTeams->removeElement($eventsTeam);
            // set the owning side to null (unless already changed)
            if ($eventsTeam->getIdTeamRonvau() === $this) {
                $eventsTeam->setIdTeamRonvau(null);
            }
        }

        return $this;
    }

    public function getTeam(): ?Team
    {
        return $this->team;
    }

    public function setTeam(?Team $team): self
    {
        $this->team = $team;

        return $this;
    }

    /**
     * @return Collection|TrainingDay[]
     */
    public function getTrainingDays(): Collection
    {
        return $this->trainingDays;
    }

    public function addTrainingDay(TrainingDay $trainingDay): self
    {
        if (!$this->trainingDays->contains($trainingDay)) {
            $this->trainingDays[] = $trainingDay;
            $trainingDay->setTeamRonvau($this);
        }

        return $this;
    }

    public function removeTrainingDay(TrainingDay $trainingDay): self
    {
        if ($this->trainingDays->contains($trainingDay)) {
            $this->trainingDays->removeElement($trainingDay);
            // set the owning side to null (unless already changed)
            if ($trainingDay->getTeamRonvau() === $this) {
                $trainingDay->setTeamRonvau(null);
            }
        }

        return $this;
    }
}
