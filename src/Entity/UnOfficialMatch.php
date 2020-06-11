<?php

namespace App\Entity;

use App\Repository\UnOfficialMatchRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass=UnOfficialMatchRepository::class)
 * @ApiResource
 */
class UnOfficialMatch
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=TeamRonvau::class, inversedBy="unOfficialMatches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $teamRonvau;

    /**
     * @ORM\ManyToOne(targetEntity=Club::class, inversedBy="unOfficialMatches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $opponent;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $ronvauTeamGoal;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $opponentGoal;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isHome;

    /**
     * @ORM\OneToMany(targetEntity=PlayerUnofficialMatch::class, mappedBy="unOfficialMatch")
     */
    private $playerUnofficialMatches;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isOver;

    /**
     * @ORM\Column(type="time", nullable=true)
     */
    private $appointmentHour;

    public function __construct()
    {
        $this->playerUnofficialMatches = new ArrayCollection();
        $this->isOver = false;
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

    public function getOpponent(): ?Club
    {
        return $this->opponent;
    }

    public function setOpponent(?Club $opponent): self
    {
        $this->opponent = $opponent;

        return $this;
    }

    public function getRonvauTeamGoal(): ?int
    {
        return $this->ronvauTeamGoal;
    }

    public function setRonvauTeamGoal(?int $ronvauTeamGoal): self
    {
        $this->ronvauTeamGoal = $ronvauTeamGoal;

        return $this;
    }

    public function getOpponentGoal(): ?int
    {
        return $this->opponentGoal;
    }

    public function setOpponentGoal(?int $opponentGoal): self
    {
        $this->opponentGoal = $opponentGoal;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getIsHome(): ?bool
    {
        return $this->isHome;
    }

    public function setIsHome(bool $isHome): self
    {
        $this->isHome = $isHome;

        return $this;
    }

    /**
     * @return Collection|PlayerUnofficialMatch[]
     */
    public function getPlayerUnofficialMatches(): Collection
    {
        return $this->playerUnofficialMatches;
    }

    public function addPlayerUnofficialMatch(PlayerUnofficialMatch $playerUnofficialMatch): self
    {
        if (!$this->playerUnofficialMatches->contains($playerUnofficialMatch)) {
            $this->playerUnofficialMatches[] = $playerUnofficialMatch;
            $playerUnofficialMatch->setUnOfficialMatch($this);
        }

        return $this;
    }

    public function removePlayerUnofficialMatch(PlayerUnofficialMatch $playerUnofficialMatch): self
    {
        if ($this->playerUnofficialMatches->contains($playerUnofficialMatch)) {
            $this->playerUnofficialMatches->removeElement($playerUnofficialMatch);
            // set the owning side to null (unless already changed)
            if ($playerUnofficialMatch->getUnOfficialMatch() === $this) {
                $playerUnofficialMatch->setUnOfficialMatch(null);
            }
        }

        return $this;
    }

    public function getIsOver(): ?bool
    {
        return $this->isOver;
    }

    public function setIsOver(bool $isOver): self
    {
        $this->isOver = $isOver;

        return $this;
    }

    public function getAppointmentHour(): ?\DateTimeInterface
    {
        return $this->appointmentHour;
    }

    public function setAppointmentHour(?\DateTimeInterface $appointmentHour): self
    {
        $this->appointmentHour = $appointmentHour;

        return $this;
    }
}
