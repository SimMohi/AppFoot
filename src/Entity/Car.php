<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CarRepository")
 */
class Car
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="cars")
     * @ORM\JoinColumn(nullable=false)
     */
    private $userId;

    /**
     * @ORM\Column(type="integer")
     */
    private $placeRemaining;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $departurePlace;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\CarPassenger", mappedBy="carId", orphanRemoval=true)
     */
    private $carPassengers;

    public function __construct()
    {
        $this->carPassengers = new ArrayCollection();
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

    public function getDeparturePlace(): ?string
    {
        return $this->departurePlace;
    }

    public function setDeparturePlace(string $departurePlace): self
    {
        $this->departurePlace = $departurePlace;

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
            $carPassenger->setCarId($this);
        }

        return $this;
    }

    public function removeCarPassenger(CarPassenger $carPassenger): self
    {
        if ($this->carPassengers->contains($carPassenger)) {
            $this->carPassengers->removeElement($carPassenger);
            // set the owning side to null (unless already changed)
            if ($carPassenger->getCarId() === $this) {
                $carPassenger->setCarId(null);
            }
        }

        return $this;
    }
}
