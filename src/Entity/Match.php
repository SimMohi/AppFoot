<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MatchRepository")
 */
class Match
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Team", inversedBy="matches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $homeTeam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Match", inversedBy="matches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $visitorTeam;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Match", mappedBy="visitorTeam", orphanRemoval=true)
     */
    private $matches;

    /**
     * @ORM\Column(type="integer")
     */
    private $homeTeamGoal;

    /**
     * @ORM\Column(type="integer")
     */
    private $visitorTeamGoal;


    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $round;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerMatch", mappedBy="idMatch")
     */
    private $playerMatches;


    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $Date;

    /**
     * @ORM\Column(type="integer")
     */
    private $MatchDay;


    public function __construct()
    {
        $this->matches = new ArrayCollection();
        $this->playerMatches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHomeTeam(): ?Team
    {
        return $this->homeTeam;
    }

    public function setHomeTeam(?Team $homeTeam): self
    {
        $this->homeTeam = $homeTeam;

        return $this;
    }

    public function getVisitorTeam(): ?self
    {
        return $this->visitorTeam;
    }

    public function setVisitorTeam(?self $visitorTeam): self
    {
        $this->visitorTeam = $visitorTeam;

        return $this;
    }

    /**
     * @return Collection|self[]
     */
    public function getMatches(): Collection
    {
        return $this->matches;
    }

    public function addMatch(self $match): self
    {
        if (!$this->matches->contains($match)) {
            $this->matches[] = $match;
            $match->setVisitorTeam($this);
        }

        return $this;
    }

    public function removeMatch(self $match): self
    {
        if ($this->matches->contains($match)) {
            $this->matches->removeElement($match);
            // set the owning side to null (unless already changed)
            if ($match->getVisitorTeam() === $this) {
                $match->setVisitorTeam(null);
            }
        }

        return $this;
    }

    public function getHomeTeamGoal(): ?int
    {
        return $this->homeTeamGoal;
    }

    public function setHomeTeamGoal(int $homeTeamGoal): self
    {
        $this->homeTeamGoal = $homeTeamGoal;

        return $this;
    }

    public function getVisitorTeamGoal(): ?int
    {
        return $this->visitorTeamGoal;
    }

    public function setVisitorTeamGoal(int $visitorTeamGoal): self
    {
        $this->visitorTeamGoal = $visitorTeamGoal;

        return $this;
    }
    

    public function getRound(): ?string
    {
        return $this->round;
    }

    public function setRound(?string $round): self
    {
        $this->round = $round;

        return $this;
    }

    /**
     * @return Collection|PlayerMatch[]
     */
    public function getPlayerMatches(): Collection
    {
        return $this->playerMatches;
    }

    public function addPlayerMatch(PlayerMatch $playerMatch): self
    {
        if (!$this->playerMatches->contains($playerMatch)) {
            $this->playerMatches[] = $playerMatch;
            $playerMatch->setIdMatch($this);
        }

        return $this;
    }

    public function removePlayerMatch(PlayerMatch $playerMatch): self
    {
        if ($this->playerMatches->contains($playerMatch)) {
            $this->playerMatches->removeElement($playerMatch);
            // set the owning side to null (unless already changed)
            if ($playerMatch->getIdMatch() === $this) {
                $playerMatch->setIdMatch(null);
            }
        }

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->Date;
    }

    public function setDate(?\DateTimeInterface $Date): self
    {
        $this->Date = $Date;

        return $this;
    }

    public function getMatchDay(): ?int
    {
        return $this->MatchDay;
    }

    public function setMatchDay(int $MatchDay): self
    {
        $this->MatchDay = $MatchDay;

        return $this;
    }
}
