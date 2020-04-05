<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
Use Symfony\Component\Serializer\Annotation\Groups;



/**
 * @ORM\Entity(repositoryClass="App\Repository\CarPassengerRepository")
 * @ApiResource
 */
class CarPassenger
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="carPassengers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"cars_read"})
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Car", inversedBy="carPassengers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $car;

    public function getId(): ?int
    {
        return $this->id;
    }

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
}
