<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Validator\Constraints as Assert; // Symfony's built-in constraints
Use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;



/**
 * @ORM\Table(name="competition", uniqueConstraints={
 *      @UniqueConstraint(name="competition_unique",
 *          columns={"season", "name_id"})
 *     }
 *  )
 * @ORM\Entity(repositoryClass="App\Repository\CompetitionRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"competitions_read"}},
 *     denormalizationContext={"disable_type_enforcement"=true}
 *)
 * @UniqueEntity(fields={"season", "name"}, message="Ce championnat se déroule déjà dans cette saison ci")
 */

class Competition
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read", "competitions_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"teams_read", "competitions_read"})
     */
    private $season;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Team", mappedBy="competition", orphanRemoval=true)
     * @Groups({"competitions_read"})
     * @ApiSubresource
     */
    private $teams;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"competitions_read"})
     */
    private $matchDayNumber;

    /**
     * @ORM\ManyToOne(targetEntity=NameCompetition::class, inversedBy="competitions")
     * @Groups({"competitions_read"})
     */
    private $name;



    public function __construct()
    {
        $this->teams = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    
    public function getSeason(): ?string
    {
        return $this->season;
    }

    public function setSeason(string $season): self
    {
        $this->season = $season;

        return $this;
    }


    /**
     * @return Collection|Team[]
     */
    public function getTeams(): Collection
    {
        return $this->teams;
    }

    public function addTeam(Team $team): self
    {
        if (!$this->teams->contains($team)) {
            $this->teams[] = $team;
            $team->setCompetition($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): self
    {
        if ($this->teams->contains($team)) {
            $this->teams->removeElement($team);
            // set the owning side to null (unless already changed)
            if ($team->getCompetition() === $this) {
                $team->setCompetition(null);
            }
        }

        return $this;
    }

    public function getMatchDayNumber(): ?int
    {
        return $this->matchDayNumber;
    }

    public function setMatchDayNumber(int $matchDayNumber): self
    {
        $this->matchDayNumber = $matchDayNumber;

        return $this;
    }

    public function getName(): ?NameCompetition
    {
        return $this->name;
    }

    public function setName(?NameCompetition $name): self
    {
        $this->name = $name;

        return $this;
    }
}
