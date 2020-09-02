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
     * @Assert\NotBlank(message="Le nom du club est obligatoire")
     * @Groups({"teams_read", "matchs_read", "clubs_read", "competitions_read"})
     */
    private $name;
    

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

    /**
     * @ORM\OneToOne(targetEntity=Address::class, inversedBy="club", cascade={"persist", "remove"})
     * @Groups({"teams_read", "clubs_read"})
     */
    private $address;

    /**
     * @ORM\OneToMany(targetEntity=UnOfficialMatch::class, mappedBy="opponent")
     */
    private $unOfficialMatches;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"clubs_read"})
     */
    private $visible = true;

    public function __construct()
    {
        $this->teams = new ArrayCollection();
        $this->unOfficialMatches = new ArrayCollection();
        $this->visible = true;
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

    public function getAddress(): ?Address
    {
        return $this->address;
    }

    public function setAddress(?Address $address): self
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return Collection|UnOfficialMatch[]
     */
    public function getUnOfficialMatches(): Collection
    {
        return $this->unOfficialMatches;
    }

    public function addUnOfficialMatch(UnOfficialMatch $unOfficialMatch): self
    {
        if (!$this->unOfficialMatches->contains($unOfficialMatch)) {
            $this->unOfficialMatches[] = $unOfficialMatch;
            $unOfficialMatch->setOpponent($this);
        }

        return $this;
    }

    public function removeUnOfficialMatch(UnOfficialMatch $unOfficialMatch): self
    {
        if ($this->unOfficialMatches->contains($unOfficialMatch)) {
            $this->unOfficialMatches->removeElement($unOfficialMatch);
            // set the owning side to null (unless already changed)
            if ($unOfficialMatch->getOpponent() === $this) {
                $unOfficialMatch->setOpponent(null);
            }
        }

        return $this;
    }

    public function getVisible(): ?bool
    {
        return $this->visible;
    }

    public function setVisible(bool $visible): self
    {
        $this->visible = $visible;

        return $this;
    }
}

