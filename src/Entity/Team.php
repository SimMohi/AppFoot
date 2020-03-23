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

/**
 *
 * @ORM\Entity(repositoryClass="App\Repository\TeamRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"teams_read"}},
 *     itemOperations={"teamNoClub"={
 *       "method"="get",
 *       "path"="/competitions/{id}/noTeams",
 *       "controller"="App\Controller\GetTeamNotInCompetitionController",
 *       "swagger_context"={
 *          "summary"="Return teams not in this competition",
 *       }
 *     }
 *  },
 * )
 *  @ApiFilter(OrderFilter::class)
 */
class Team
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read",})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Club", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"teams_read",})
     */
    private $idClub;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Competition", inversedBy="teams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"teams_read",})
     *
     */
    private $idCompetition;

    /**
     * @ORM\Column(type="integer", nullable=true,options={"default" : 0})
     * @Groups({"teams_read",})
     */
    private $won;

    /**
     * @ORM\Column(type="integer", nullable=true,options={"default" : 0})
     * @Groups({"teams_read",})
     */
    private $drawn;

    /**
     * @ORM\Column(type="integer", nullable=true, options={"default" : 0})
     * @Groups({"teams_read",})
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

    public function getWon(): ?int
    {
        return $this->won;
    }

    public function setWon(int $won): self
    {
        $this->won = $won;

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
    /**
    * @Groups({"teams_read",})
    * @return integer
    */
     public function getNbrMatchs(){
        return $this->won + $this->drawn + $this->lost;
    }

    /**
     * @Groups({"teams_read",})
     * @return integer
     */
    public function getNbrPoints(){
        return $this->won * 3 + $this->drawn;
    }
}
