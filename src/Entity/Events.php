<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\EventsRepository")
 */
class Events
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
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $date;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\EventsTeam", mappedBy="idEvents", orphanRemoval=true)
     */
    private $eventsTeams;

    public function __construct()
    {
        $this->eventsTeams = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(?\DateTimeInterface $date): self
    {
        $this->date = $date;

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
            $eventsTeam->setIdEvents($this);
        }

        return $this;
    }

    public function removeEventsTeam(EventsTeam $eventsTeam): self
    {
        if ($this->eventsTeams->contains($eventsTeam)) {
            $this->eventsTeams->removeElement($eventsTeam);
            // set the owning side to null (unless already changed)
            if ($eventsTeam->getIdEvents() === $this) {
                $eventsTeam->setIdEvents(null);
            }
        }

        return $this;
    }
}
