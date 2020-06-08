<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;



/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerMatchRepository")
 * @ApiResource
 * @ApiFilter(SearchFilter::class , properties={"idMatch": "exact", "idUserTeam": "exact"})
 * @ApiFilter(BooleanFilter::class, properties={"hasConfirmed", "hasRefused"})
 */
class PlayerMatch
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"matchs_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Matche", inversedBy="playerMatches")
     */
    private $idMatch;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserTeam", inversedBy="playerMatches")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"matchs_read"})
     */
    private $idUserTeam;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"matchs_read"})
     */
    private $played;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"matchs_read"})
     */
    private $goal;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"matchs_read"})
     */
    private $yellowCard;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"matchs_read"})
     */
    private $redCard;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"team_ronvau_read", "matchs_read"})
     */
    private $hasConfirmed;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"team_ronvau_read", "matchs_read"})
     */
    private $hasRefused;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerOfTheMatch", mappedBy="idPlayerMatch", orphanRemoval=true))
     */
    private $playerOfTheMatches;

    /**
     * @Groups({"team_ronvau_read", "matchs_read"})
     * @ORM\Column(type="text", nullable=true)
     */
    private $refusedJustification;

    public function __construct()
    {
        $this->setPlayed(false);
        $this->setHasConfirmed(false);
        $this->setHasRefused(false);
        $this->playerOfTheMatches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdMatch(): ?Matche
    {
        return $this->idMatch;
    }

    public function setIdMatch(?Matche $idMatch): self
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

    public function getPlayed(): ?bool
    {
        return $this->played;
    }

    public function setPlayed(bool $played): self
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

    public function getRedCard(): ?bool
    {
        return $this->redCard;
    }

    public function setRedCard(bool $redCard): self
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

    public function getHasRefused(): ?bool
    {
        return $this->hasRefused;
    }

    public function setHasRefused(bool $hasRefused): self
    {
        $this->hasRefused = $hasRefused;

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

    public function getRefusedJustification(): ?string
    {
        return $this->refusedJustification;
    }

    public function setRefusedJustification(?string $refusedJustification): self
    {
        $this->refusedJustification = $refusedJustification;

        return $this;
    }
}
