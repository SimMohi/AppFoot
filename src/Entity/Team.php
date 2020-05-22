<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints as Assert;
Use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;


/**
 *
 * @ORM\Entity(repositoryClass="App\Repository\TeamRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"teams_read"}},
 * )
 * @ApiFilter(SearchFilter::class , properties={"competition": "exact"})
 */
class Team
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read", "matchs_read", "competitions_read", "clubs_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Club", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"teams_read", "matchs_read", "competitions_read"})
     */
    private $club;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Competition", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"teams_read", "clubs_read", "team_ronvau_read"})
     *
     */
    private $competition;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Matche", mappedBy="homeTeam")
     */
    private $matchA;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Matche", mappedBy="visitorTeam")
     */
    private $matchB;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"teams_read", "competitions_read", "clubs_read"})
     */
    private $day;

    /**
     * @ORM\Column(type="time", nullable=true)
     * @Groups({"teams_read", "competitions_read", "clubs_read"})
     */
    private $hour;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\TeamRonvau", mappedBy="team", cascade={"persist", "remove"})
     * @Groups({"matchs_read"})
     */
    private $teamRonvau;


    public function __construct()
    {
        $this->matchA = new ArrayCollection();
        $this->matchB = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClub(): ?Club
    {
        return $this->club;
    }

    public function setClub(?Club $club): self
    {
        $this->club = $club;

        return $this;
    }

    public function getCompetition(): ?Competition
    {
        return $this->competition;
    }

    public function setCompetition(?Competition $competition): self
    {
        $this->competition = $competition;

        return $this;
    }


    /**
     * @return Collection|Matc[]
     */
    public function getMatchA(): Collection
    {
        return $this->matchA;
    }

    public function addMatchA(Matche $matchA): self
    {
        if (!$this->matchA->contains($matchA)) {
            $this->matchA[] = $matchA;
            $matchA->setHomeTeam($this);
        }

        return $this;
    }

    public function removeMatchA(Matche $matchA): self
    {
        if ($this->matchA->contains($matchA)) {
            $this->matchA->removeElement($matchA);
            // set the owning side to null (unless already changed)
            if ($matchA->getHomeTeam() === $this) {
                $matchA->setHomeTeam(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Matc[]
     */
    public function getMatchB(): Collection
    {
        return $this->matchB;
    }

    public function addMatchB(Matche $matchB): self
    {
        if (!$this->matchB->contains($matchB)) {
            $this->matchB[] = $matchB;
            $matchB->setVisitorTeam($this);
        }
        return $this;
    }

    public function removeMatchB(Matche $matchB): self
    {
        if ($this->matchB->contains($matchB)) {
            $this->matchB->removeElement($matchB);
            // set the owning side to null (unless already changed)
            if ($matchB->getVisitorTeam() === $this) {
                $matchB->setVisitorTeam(null);
            }
        }

        return $this;
    }

    public function getDay(): ?string
    {
        return $this->day;
    }

    public function setDay(?string $day): self
    {
        $this->day = $day;

        return $this;
    }

    public function getHour(): ?\DateTimeInterface
    {
        return $this->hour;
    }

    public function setHour(?\DateTimeInterface $hour): self
    {
        $this->hour = $hour;

        return $this;
    }

    public function getTeamRonvau(): ?TeamRonvau
    {
        return $this->teamRonvau;
    }

    public function setTeamRonvau(?TeamRonvau $teamRonvau): self
    {
        $this->teamRonvau = $teamRonvau;

        // set (or unset) the owning side of the relation if necessary
        $newTeam = null === $teamRonvau ? null : $this;
        if ($teamRonvau->getTeam() !== $newTeam) {
            $teamRonvau->setTeam($newTeam);
        }

        return $this;
    }
}
