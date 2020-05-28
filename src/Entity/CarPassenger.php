<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping\UniqueConstraint;


/**
 * @ORM\Table(name="car_passenger", uniqueConstraints={
 *     @UniqueConstraint(name="car_passenger_unique",
 *         columns={"user_id", "car_id"})
 *     }
 * )
 *
 * @ORM\Entity(repositoryClass="App\Repository\CarPassengerRepository")
 * @ApiResource(
 *   denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @UniqueEntity(fields={"user", "car"}, message="Vous avez déjà fait une demande pour ce covoiturage")
 */
class CarPassenger
{

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="carPassengers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"cars_read"})
     */
    private $user;

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity="App\Entity\Car", inversedBy="carPassengers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $car;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"cars_read"})
     */
    private $comment;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"cars_read"})
     */
    private $numberPassenger;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"cars_read"})
     */
    private $isAccepted;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"cars_read"})
     */
    private $answer;

    /**
     * @ORM\ManyToOne(targetEntity=Address::class, inversedBy="carPassengers")
     */
    private $address;

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCar(): ?Car
    {
        return $this->car;
    }

    public function setCar(?Car $car): self
    {
        $this->car = $car;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getNumberPassenger(): ?int
    {
        return $this->numberPassenger;
    }

    public function setNumberPassenger(int $numberPassenger): self
    {
        $this->numberPassenger = $numberPassenger;

        return $this;
    }

    public function getIsAccepted(): ?bool
    {
        return $this->isAccepted;
    }

    public function setIsAccepted(bool $isAccepted): self
    {
        $this->isAccepted = $isAccepted;

        return $this;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(?string $answer): self
    {
        $this->answer = $answer;

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
}
