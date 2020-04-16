<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TrainingDayRepository")
 */
class TrainingDay
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $day;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TeamRonvau", inversedBy="trainingDays")
     * @ORM\JoinColumn(nullable=false)
     */
    private $teamRonvau;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDay(): ?int
    {
        return $this->day;
    }

    public function setDay(int $day): self
    {
        $this->day = $day;

        return $this;
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
}
