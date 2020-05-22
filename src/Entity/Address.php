<?php

namespace App\Entity;

use App\Repository\AddressRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass="App\Repository\AddressRepository")
 * @ApiResource(
 *     normalizationContext={
 *      "groups"={"address_read"}
 *  },
 *     denormalizationContext={"disable_type_enforcement"=true}
 * )
 */
class Address
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"address_read"})
     *
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"clubs_read"})
     *
     */
    private $street;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"clubs_read"})
     *
     */
    private $code;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"clubs_read"})
     *
     */
    private $number;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"clubs_read"})
     *
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     *
     */
    private $box;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="address")
     */
    private $users;

    /**
     * @ORM\OneToOne(targetEntity=Club::class, mappedBy="address", cascade={"persist", "remove"})
     */
    private $club;

    public function __construct()
    {
        $this->users = new ArrayCollection();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getBox(): ?string
    {
        return $this->box;
    }

    public function setBox(?string $box): self
    {
        $this->box = $box;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setAddress($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getAddress() === $this) {
                $user->setAddress(null);
            }
        }

        return $this;
    }

    public function getClub(): ?Club
    {
        return $this->club;
    }

    public function setClub(?Club $club): self
    {
        $this->club = $club;

        // set (or unset) the owning side of the relation if necessary
        $newAddress = null === $club ? null : $this;
        if ($club->getAddress() !== $newAddress) {
            $club->setAddress($newAddress);
        }

        return $this;
    }
}
