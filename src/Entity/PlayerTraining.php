<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PlayerTrainingRepository")
 */
class PlayerTraining
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\UserTeam", inversedBy="playerTrainings")
     */
    private $idUserTeam;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Training", inversedBy="playerTrainings")
     * @ORM\JoinColumn(nullable=false)
     */
    private $idTraining;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hasComfirmed;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $absenceJustification;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdUserTeam(): ?UserTeam
    {
        return $this->idUserTeam;
    }

    public function setIdUserTeam(?UserTeam $idUserTeam): self
    {
        $this->idUserTeam = $idUserTeam;

        return $this;
    }

    public function getIdTraining(): ?Training
    {
        return $this->idTraining;
    }

    public function setIdTraining(?Training $idTraining): self
    {
        $this->idTraining = $idTraining;

        return $this;
    }

    public function getHasComfirmed(): ?bool
    {
        return $this->hasComfirmed;
    }

    public function setHasComfirmed(bool $hasComfirmed): self
    {
        $this->hasComfirmed = $hasComfirmed;

        return $this;
    }

    public function getAbsenceJustification(): ?string
    {
        return $this->absenceJustification;
    }

    public function setAbsenceJustification(?string $absenceJustification): self
    {
        $this->absenceJustification = $absenceJustification;

        return $this;
    }
}
