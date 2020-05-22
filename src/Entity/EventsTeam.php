<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;


/**
 * @ORM\Table(name="events_team", uniqueConstraints={
 *      @UniqueConstraint(name="event_team_unique",
 *          columns={"id_team_ronvau_id", "id_events_id"})
 *     }
 *  )
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
     * @ORM\ManyToOne(targetEntity="App\Entity\Event", inversedBy="eventsTeams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idEvents;

    /**
     * @ORM\OneToMany(targetEntity=UserTeamEvent::class, mappedBy="eventTeam")
     */
    private $userTeamEvents;

    public function __construct()
    {
        $this->userTeamEvents = new ArrayCollection();
    }

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

    public function getIdEvents(): ?Event
    {
        return $this->idEvents;
    }

    public function setIdEvents(?Event $idEvents): self
    {
        $this->idEvents = $idEvents;

        return $this;
    }

    /**
     * @return Collection|UserTeamEvent[]
     */
    public function getUserTeamEvents(): Collection
    {
        return $this->userTeamEvents;
    }

    public function addUserTeamEvent(UserTeamEvent $userTeamEvent): self
    {
        if (!$this->userTeamEvents->contains($userTeamEvent)) {
            $this->userTeamEvents[] = $userTeamEvent;
            $userTeamEvent->setEventTeam($this);
        }

        return $this;
    }

    public function removeUserTeamEvent(UserTeamEvent $userTeamEvent): self
    {
        if ($this->userTeamEvents->contains($userTeamEvent)) {
            $this->userTeamEvents->removeElement($userTeamEvent);
            // set the owning side to null (unless already changed)
            if ($userTeamEvent->getEventTeam() === $this) {
                $userTeamEvent->setEventTeam(null);
            }
        }

        return $this;
    }
}
