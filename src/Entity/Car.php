<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass="App\Repository\CarRepository")
 * @ApiResource(
 *  denormalizationContext={"disable_type_enforcement"=true},
 *  normalizationContext={"groups"={"cars_read"}},
 *
 *)
 */
class Car
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"cars_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="cars")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"cars_read"})
     */
    private $userId;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"cars_read"})
     *
     */
    private $placeRemaining;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"cars_read"})
     */
    private $date;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CarPassenger", mappedBy="car", orphanRemoval=true)
     * @Groups({"cars_read"})
     *
     */
    private $carPassengers;

    /**
     * @ORM\ManyToOne(targetEntity=Address::class, inversedBy="cars")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"cars_read"})
     */
    private $departureAddress;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min=3, minMessage="Le titre doit faire au mininum 3 caractères", max=255, maxMessage="Entre 3 et 255")
     * @Groups({"cars_read"})
     */
    private $title;

    /**
     * @ORM\OneToMany(targetEntity=CovoitChat::class, mappedBy="car", orphanRemoval=true)
     */
    private $covoitChats;

    public function __construct()
    {
        $this->carPassengers = new ArrayCollection();
        $this->covoitChats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $userId): self
    {
        $this->userId = $userId;

        return $this;
    }

    public function getPlaceRemaining(): ?int
    {
        return $this->placeRemaining;
    }

    public function setPlaceRemaining(int $placeRemaining): self
    {
        $this->placeRemaining = $placeRemaining;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

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
            $carPassenger->setCar($this);
        }

        return $this;
    }

    public function removeCarPassenger(CarPassenger $carPassenger): self
    {
        if ($this->carPassengers->contains($carPassenger)) {
            $this->carPassengers->removeElement($carPassenger);
            // set the owning side to null (unless already changed)
            if ($carPassenger->getCar() === $this) {
                $carPassenger->setCar(null);
            }
        }

        return $this;
    }

    public function getDepartureAddress(): ?Address
    {
        return $this->departureAddress;
    }

    public function setDepartureAddress(?Address $departureAddress): self
    {
        $this->departureAddress = $departureAddress;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection|CovoitChat[]
     */
    public function getCovoitChats(): Collection
    {
        return $this->covoitChats;
    }

    public function addCovoitChat(CovoitChat $covoitChat): self
    {
        if (!$this->covoitChats->contains($covoitChat)) {
            $this->covoitChats[] = $covoitChat;
            $covoitChat->setCar($this);
        }

        return $this;
    }

    public function removeCovoitChat(CovoitChat $covoitChat): self
    {
        if ($this->covoitChats->contains($covoitChat)) {
            $this->covoitChats->removeElement($covoitChat);
            // set the owning side to null (unless already changed)
            if ($covoitChat->getCar() === $this) {
                $covoitChat->setCar(null);
            }
        }

        return $this;
    }
}
