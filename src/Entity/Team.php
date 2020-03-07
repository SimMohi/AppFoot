<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TeamRepository")
 */
class Team
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Club", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idClub;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Competition", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idCompetition;

    /**
     * @ORM\Column(type="integer")
     */
    private $played;

    /**
     * @ORM\Column(type="integer")
     */
    private $drawn;

    /**
     * @ORM\Column(type="integer")
     */
    private $lost;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Match", mappedBy="homeTeam", orphanRemoval=true)
     */
    private $matches;

    public function __construct()
    {
        $this->matches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdClub(): ?Club
    {
        return $this->idClub;
    }

    public function setIdClub(?Club $idClub): self
    {
        $this->idClub = $idClub;

        return $this;
    }

    public function getIdCompetition(): ?Competition
    {
        return $this->idCompetition;
    }

    public function setIdCompetition(?Competition $idCompetition): self
    {
        $this->idCompetition = $idCompetition;

        return $this;
    }

    public function getPlayed(): ?int
    {
        return $this->played;
    }

    public function setPlayed(int $played): self
    {
        $this->played = $played;

        return $this;
    }

    public function getDrawn(): ?int
    {
        return $this->drawn;
    }

    public function setDrawn(int $drawn): self
    {
        $this->drawn = $drawn;

        return $this;
    }

    public function getLost(): ?int
    {
        return $this->lost;
    }

    public function setLost(int $lost): self
    {
        $this->lost = $lost;

        return $this;
    }

    /**
     * @return Collection|Match[]
     */
    public function getMatches(): Collection
    {
        return $this->matches;
    }

    public function addMatch(Match $match): self
    {
        if (!$this->matches->contains($match)) {
            $this->matches[] = $match;
            $match->setHomeTeam($this);
        }

        return $this;
    }

    public function removeMatch(Match $match): self
    {
        if ($this->matches->contains($match)) {
            $this->matches->removeElement($match);
            // set the owning side to null (unless already changed)
            if ($match->getHomeTeam() === $this) {
                $match->setHomeTeam(null);
            }
        }

        return $this;
    }
}
