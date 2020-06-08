<?php

namespace App\Entity;

use App\Repository\PlayerUnofficialMatchRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping\UniqueConstraint;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Table(name="player_unofficial_match", uniqueConstraints={
 *     @UniqueConstraint(name="un_official_match_unique",
 *         columns={"user_team_id", "un_official_match_id"})
 *     }
 * )
 * @ApiResource(
 *     normalizationContext={
 *      "groups"={"unoffP_read"}
 *  }
 * )
 * @ORM\Entity(repositoryClass=PlayerUnofficialMatchRepository::class)
 * @UniqueEntity(fields={"userTeam", "unOfficialMatch"}, message="Ce joueur participe déjà à ce match")
 */
class PlayerUnofficialMatch
{
    /**
     *
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity=UserTeam::class, inversedBy="playerUnofficialMatches")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"unoffP_read"})
     */
    private $userTeam;

    /**
     * @ORM\Id()
     * @ORM\ManyToOne(targetEntity=UnOfficialMatch::class, inversedBy="playerUnofficialMatches")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"unoffP_read"})
     */
    private $unOfficialMatch;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"unoffP_read"})
     */
    private $played;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"unoffP_read"})
     */
    private $goal;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"unoffP_read"})
     */
    private $yellowCard;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"unoffP_read"})
     */
    private $redCard;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"unoffP_read"})
     */
    private $hasConfirmed;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"unoffP_read"})
     */
    private $hasRefused;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"unoffP_read"})
     */
    private $refusedJustification;

    public function __construct()
    {
        $this->hasRefused = false;
        $this->hasConfirmed = false;
    }

    public function getUserTeam(): ?UserTeam
    {
        return $this->userTeam;
    }

    public function setUserTeam(?UserTeam $userTeam): self
    {
        $this->userTeam = $userTeam;

        return $this;
    }

    public function getUnOfficialMatch(): ?UnOfficialMatch
    {
        return $this->unOfficialMatch;
    }

    public function setUnOfficialMatch(?UnOfficialMatch $unOfficialMatch): self
    {
        $this->unOfficialMatch = $unOfficialMatch;

        return $this;
    }

    public function getPlayed(): ?bool
    {
        return $this->played;
    }

    public function setPlayed(?bool $played): self
    {
        $this->played = $played;

        return $this;
    }

    public function getGoal(): ?int
    {
        return $this->goal;
    }

    public function setGoal(?int $goal): self
    {
        $this->goal = $goal;

        return $this;
    }

    public function getYellowCard(): ?int
    {
        return $this->yellowCard;
    }

    public function setYellowCard(?int $yellowCard): self
    {
        $this->yellowCard = $yellowCard;

        return $this;
    }

    public function getRedCard(): ?int
    {
        return $this->redCard;
    }

    public function setRedCard(?int $redCard): self
    {
        $this->redCard = $redCard;

        return $this;
    }

    public function getHasConfirmed(): ?bool
    {
        return $this->hasConfirmed;
    }

    public function setHasConfirmed(bool $hasConfirmed): self
    {
        $this->hasConfirmed = $hasConfirmed;

        return $this;
    }

    public function getHasRefused(): ?bool
    {
        return $this->hasRefused;
    }

    public function setHasRefused(bool $hasRefused): self
    {
        $this->hasRefused = $hasRefused;

        return $this;
    }

    public function getRefusedJustification(): ?string
    {
        return $this->refusedJustification;
    }

    public function setRefusedJustification(?string $refusedJustification): self
    {
        $this->refusedJustification = $refusedJustification;

        return $this;
    }
}
