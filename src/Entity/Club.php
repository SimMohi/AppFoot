<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\ClubRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"clubs_read"}},
 * )
 */
class Club
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"teams_read", "clubs_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min=3, minMessage="Entre 3 et 255", max=255, maxMessage="Entre 3 et 255")
     * @Assert\NotBlank(message="Le prénom du customer est obligatoire")
     * @Groups({"teams_read", "matchs_read", "clubs_read", "competitions_read"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"teams_read", "clubs_read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"teams_read", "clubs_read"})
     */
    private $Logo;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Team", mappedBy="club", orphanRemoval=true)
     * @Groups({"clubs_read"})
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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->Logo;
    }

    public function setLogo(?string $Logo): self
    {
        $this->Logo = $Logo;

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
            $team->setClub($this);
        }

        return $this;
    }

    public function removeTeam(Team $team): self
    {
        if ($this->teams->contains($team)) {
            $this->teams->removeElement($team);
            // set the owning side to null (unless already changed)
            if ($team->getClub() === $this) {
                $team->setClub(null);
            }
        }

        return $this;
    }
}
