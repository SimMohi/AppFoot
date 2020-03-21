<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Validator\Constraints as Assert; // Symfony's built-in constraints
Use Symfony\Component\Serializer\Annotation\Groups;




/**
 * @ORM\Entity(repositoryClass="App\Repository\CompetitionRepository")
 * @ApiResource
 */
class Competition
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read",})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom de la compéttion est obligatoire")
     * @Assert\Length(min=2, minMessage="Le nom de la compéttion doit faire entre 2 et 255 caractères", max=255, maxMessage="Le nom de la compéttion doit faire entre 2 et 255 caractères")
     * @Groups({"teams_read",})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"teams_read",})
     */
    private $season;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"teams_read",})
     */
    private $format;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Team", mappedBy="idCompetition", orphanRemoval=true)
     */
    private $teams;

    public function __construct()
    {
        $this->teams = new ArrayCollection();
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

    public function getSeason(): ?string
    {
        return $this->season;
    }

    public function setSeason(string $season): self
    {
        $this->season = $season;

        return $this;
    }

    public function getFormat(): ?string
    {
        return $this->format;
    }

    public function setFormat(string $format): self
    {
        $this->format = $format;

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
            $team->setIdCompetition($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): self
    {
        if ($this->teams->contains($team)) {
            $this->teams->removeElement($team);
            // set the owning side to null (unless already changed)
            if ($team->getIdCompetition() === $this) {
                $team->setIdCompetition(null);
            }
        }

        return $this;
    }
}
