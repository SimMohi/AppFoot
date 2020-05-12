<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;


/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerOfTheMatchRepository")
 * @ApiResource
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
     * @ORM\ManyToOne(targetEntity="App\Entity\UserTeam", inversedBy="playerOfTheMatches")
     * @ORM\JoinColumn(nullable=false)
     */
    private $userTeam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\PlayerMatch", inversedBy="playerOfTheMatches")
     */
    private $idPlayerMatch;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUserTeam(): ?UserTeam
    {
        return $this->userTeam;
    }

    public function setIdUserTeam(?UserTeam $userTeam): self
    {
        $this->userTeam = $userTeam;

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
