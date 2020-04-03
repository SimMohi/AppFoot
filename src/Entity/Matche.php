<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
Use Symfony\Component\Serializer\Annotation\Groups;



/**
 * @ORM\Entity(repositoryClass="App\Repository\MatcheRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"matchs_read"}},
 *     denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(SearchFilter::class , properties={"matchDay": "exact"})
 */

class Matche
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"matchs_read",})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Team", inversedBy="matchA")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"matchs_read",})
     */
    private $homeTeam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Team", inversedBy="matchB")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"matchs_read",})
     */
    private $visitorTeam;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"matchs_read",})
     */
    private $homeTeamGoal;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"matchs_read",})
     */
    private $visitorTeamGoal;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"matchs_read",})
     */
    private $date;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"matchs_read",})
     */
    private $matchDay;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerMatch", mappedBy="idMatch")
     */
    private $playerMatches;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isOver;

    public function __construct()
    {
        $this->playerMatches = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHomeTeam(): ?team
    {
        return $this->homeTeam;
    }

    public function setHomeTeam(?team $homeTeam): self
    {
        $this->homeTeam = $homeTeam;

        return $this;
    }

    public function getVisitorTeam(): ?team
    {
        return $this->visitorTeam;
    }

    public function setVisitorTeam(?team $visitorTeam): self
    {
        $this->visitorTeam = $visitorTeam;

        return $this;
    }

    public function getHomeTeamGoal(): ?int
    {
        return $this->homeTeamGoal;
    }

    public function setHomeTeamGoal(?int $homeTeamGoal): self
    {
        $this->homeTeamGoal = $homeTeamGoal;

        return $this;
    }

    public function getVisitorTeamGoal(): ?int
    {
        return $this->visitorTeamGoal;
    }

    public function setVisitorTeamGoal(?int $visitorTeamGoal): self
    {
        $this->visitorTeamGoal = $visitorTeamGoal;

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

    public function getMatchDay(): ?int
    {
        return $this->matchDay;
    }

    public function setMatchDay(?int $matchDay): self
    {
        $this->matchDay = $matchDay;

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

    public function getIsOver(): ?bool
    {
        return $this->isOver;
    }

    public function setIsOver(bool $isOver): self
    {
        $this->isOver = $isOver;

        return $this;
    }
}
