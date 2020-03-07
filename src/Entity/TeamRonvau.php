<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TeamRonvauRepository")
 */
class TeamRonvau
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $category;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $coach;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $coachPhone;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTeam", mappedBy="teamRonvauId")
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

    public function __construct()
    {
        $this->userTeams = new ArrayCollection();
        $this->trainings = new ArrayCollection();
        $this->eventsTeams = new ArrayCollection();
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
}
