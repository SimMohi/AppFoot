<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ApiResource(
 *  normalizationContext={
 *      "groups"={"users_read"}
 *  }
 * )
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"users_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"users_read"}) 
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"users_read"}) 
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read"})
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"users_read"})
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $gsm;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $profilePic;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\UserTeam", mappedBy="userId")
     */
    private $userTeams;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerOfTheMatch", mappedBy="idUser")
     */
    private $playerOfTheMatches;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Car", mappedBy="userId", orphanRemoval=true)
     */
    private $cars;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CarPassenger", mappedBy="userId")
     */
    private $carPassengers;

    public function __construct()
    {
        $this->userTeams = new ArrayCollection();
        $this->playerOfTheMatches = new ArrayCollection();
        $this->cars = new ArrayCollection();
        $this->carPassengers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getGsm(): ?string
    {
        return $this->gsm;
    }

    public function setGsm(?string $gsm): self
    {
        $this->gsm = $gsm;

        return $this;
    }

    public function getProfilePic(): ?string
    {
        return $this->profilePic;
    }

    public function setProfilePic(?string $profilePic): self
    {
        $this->profilePic = $profilePic;

        return $this;
    }

    /**
     * @return Collection|UserTeam[]
     */
    public function getUserTeams(): Collection
    {
        return $this->userTeams;
    }

    public function addUserTeam(UserTeam $userTeam): self
    {
        if (!$this->userTeams->contains($userTeam)) {
            $this->userTeams[] = $userTeam;
            $userTeam->setUserId($this);
        }

        return $this;
    }

    public function removeUserTeam(UserTeam $userTeam): self
    {
        if ($this->userTeams->contains($userTeam)) {
            $this->userTeams->removeElement($userTeam);
            // set the owning side to null (unless already changed)
            if ($userTeam->getUserId() === $this) {
                $userTeam->setUserId(null);
            }
        }

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
            $playerOfTheMatch->setIdUser($this);
        }

        return $this;
    }

    public function removePlayerOfTheMatch(PlayerOfTheMatch $playerOfTheMatch): self
    {
        if ($this->playerOfTheMatches->contains($playerOfTheMatch)) {
            $this->playerOfTheMatches->removeElement($playerOfTheMatch);
            // set the owning side to null (unless already changed)
            if ($playerOfTheMatch->getIdUser() === $this) {
                $playerOfTheMatch->setIdUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Car[]
     */
    public function getCars(): Collection
    {
        return $this->cars;
    }

    public function addCar(Car $car): self
    {
        if (!$this->cars->contains($car)) {
            $this->cars[] = $car;
            $car->setUserId($this);
        }

        return $this;
    }

    public function removeCar(Car $car): self
    {
        if ($this->cars->contains($car)) {
            $this->cars->removeElement($car);
            // set the owning side to null (unless already changed)
            if ($car->getUserId() === $this) {
                $car->setUserId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|CarPassenger[]
     */
    public function getCarPassengers(): Collection
    {
        return $this->carPassengers;
    }

    public function addCarPassenger(CarPassenger $carPassenger): self
    {
        if (!$this->carPassengers->contains($carPassenger)) {
            $this->carPassengers[] = $carPassenger;
            $carPassenger->setUserId($this);
        }

        return $this;
    }

    public function removeCarPassenger(CarPassenger $carPassenger): self
    {
        if ($this->carPassengers->contains($carPassenger)) {
            $this->carPassengers->removeElement($carPassenger);
            // set the owning side to null (unless already changed)
            if ($carPassenger->getUserId() === $this) {
                $carPassenger->setUserId(null);
            }
        }

        return $this;
    }
}
