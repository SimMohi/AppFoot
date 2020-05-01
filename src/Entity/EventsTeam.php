<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass="App\Repository\EventsTeamRepository")
 * @ApiResource
 */
class EventsTeam
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TeamRonvau", inversedBy="eventsTeams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"events_read"})
     */
    private $idTeamRonvau;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Events", inversedBy="eventsTeams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idEvents;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdTeamRonvau(): ?TeamRonvau
    {
        return $this->idTeamRonvau;
    }

    public function setIdTeamRonvau(?TeamRonvau $idTeamRonvau): self
    {
        $this->idTeamRonvau = $idTeamRonvau;

        return $this;
    }

    public function getIdEvents(): ?Events
    {
        return $this->idEvents;
    }

    public function setIdEvents(?Events $idEvents): self
    {
        $this->idEvents = $idEvents;

        return $this;
    }
}
