<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerMatchRepository")
 */
class PlayerMatch
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Match", inversedBy="playerMatches")
     */
    private $idMatch;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserTeam", inversedBy="playerMatches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idUserTeam;

    /**
     * @ORM\Column(type="integer")
     */
    private $played;

    /**
     * @ORM\Column(type="integer")
     */
    private $goal;

    /**
     * @ORM\Column(type="integer")
     */
    private $yellowCard;

    /**
     * @ORM\Column(type="integer")
     */
    private $redCard;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasConfirmed;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerOfTheMatch", mappedBy="idPlayerMatch")
     */
    private $playerOfTheMatches;

    public function __construct()
    {
        $this->playerOfTheMatches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdMatch(): ?Match
    {
        return $this->idMatch;
    }

    public function setIdMatch(?Match $idMatch): self
    {
        $this->idMatch = $idMatch;

        return $this;
    }

    public function getIdUserTeam(): ?UserTeam
    {
        return $this->idUserTeam;
    }

    public function setIdUserTeam(?UserTeam $idUserTeam): self
    {
        $this->idUserTeam = $idUserTeam;

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

    public function getGoal(): ?int
    {
        return $this->goal;
    }

    public function setGoal(int $goal): self
    {
        $this->goal = $goal;

        return $this;
    }

    public function getYellowCard(): ?int
    {
        return $this->yellowCard;
    }

    public function setYellowCard(int $yellowCard): self
    {
        $this->yellowCard = $yellowCard;

        return $this;
    }

    public function getRedCard(): ?int
    {
        return $this->redCard;
    }

    public function setRedCard(int $redCard): self
    {
        $this->redCard = $redCard;

        return $this;
    }

    public function getHasConfirmed(): ?bool
    {
        return $this->hasConfirmed;
    }

    public function setHasConfirmed(bool $hasConfirmed): self
    {
        $this->hasConfirmed = $hasConfirmed;

        return $this;
    }

    /**
     * @return Collection|PlayerOfTheMatch[]
     */
    public function getPlayerOfTheMatches(): Collection
    {
        return $this->playerOfTheMatches;
    }

    public function addPlayerOfTheMatch(PlayerOfTheMatch $playerOfTheMatch): self
    {
        if (!$this->playerOfTheMatches->contains($playerOfTheMatch)) {
            $this->playerOfTheMatches[] = $playerOfTheMatch;
            $playerOfTheMatch->setIdPlayerMatch($this);
        }

        return $this;
    }

    public function removePlayerOfTheMatch(PlayerOfTheMatch $playerOfTheMatch): self
    {
        if ($this->playerOfTheMatches->contains($playerOfTheMatch)) {
            $this->playerOfTheMatches->removeElement($playerOfTheMatch);
            // set the owning side to null (unless already changed)
            if ($playerOfTheMatch->getIdPlayerMatch() === $this) {
                $playerOfTheMatch->setIdPlayerMatch(null);
            }
        }

        return $this;
    }
}
