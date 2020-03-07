<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerOfTheMatchRepository")
 */
class PlayerOfTheMatch
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="playerOfTheMatches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idUser;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\PlayerMatch", inversedBy="playerOfTheMatches")
     */
    private $idPlayerMatch;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUser(): ?User
    {
        return $this->idUser;
    }

    public function setIdUser(?User $idUser): self
    {
        $this->idUser = $idUser;

        return $this;
    }

    public function getIdPlayerMatch(): ?PlayerMatch
    {
        return $this->idPlayerMatch;
    }

    public function setIdPlayerMatch(?PlayerMatch $idPlayerMatch): self
    {
        $this->idPlayerMatch = $idPlayerMatch;

        return $this;
    }
}
