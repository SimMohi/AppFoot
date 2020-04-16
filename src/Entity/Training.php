<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TrainingRepository")
 */
class Training
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TeamRonvau", inversedBy="trainings")
     * @ORM\JoinColumn(nullable=false)
     */
    private $teamRonvau;

    /**
     * @ORM\Column(type="integer")
     */
    private $day;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerTraining", mappedBy="idTraining", orphanRemoval=true)
     */
    private $playerTrainings;

    public function __construct()
    {
        $this->playerTrainings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTeamRonvau(): ?TeamRonvau
    {
        return $this->teamRonvau;
    }

    public function setTeamRonvau(?TeamRonvau $teamRonvau): self
    {
        $this->teamRonvau = $teamRonvau;

        return $this;
    }

    public function getDay(): ?int
    {
        return $this->day;
    }

    public function setDate(int $day): self
    {
        $this->day = $day;

        return $this;
    }

    /**
     * @return Collection|PlayerTraining[]
     */
    public function getPlayerTrainings(): Collection
    {
        return $this->playerTrainings;
    }

    public function addPlayerTraining(PlayerTraining $playerTraining): self
    {
        if (!$this->playerTrainings->contains($playerTraining)) {
            $this->playerTrainings[] = $playerTraining;
            $playerTraining->setIdTraining($this);
        }

        return $this;
    }

    public function removePlayerTraining(PlayerTraining $playerTraining): self
    {
        if ($this->playerTrainings->contains($playerTraining)) {
            $this->playerTrainings->removeElement($playerTraining);
            // set the owning side to null (unless already changed)
            if ($playerTraining->getIdTraining() === $this) {
                $playerTraining->setIdTraining(null);
            }
        }

        return $this;
    }
}
