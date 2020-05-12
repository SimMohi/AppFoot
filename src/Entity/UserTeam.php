<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
Use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping\UniqueConstraint;


/**
 * @ORM\Table(name="user_team", uniqueConstraints={
 *     @UniqueConstraint(name="user_team_unique",
 *         columns={"user_id_id", "team_ronvau_id_id"})
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\UserTeamRepository")
 * @ApiResource(
 *     normalizationContext={"groups"={"user_team_read"}},
 * )
 */
class UserTeam
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"team_ronvau_read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="userTeams")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"team_ronvau_read", "matchs_read"})
     */
    private $userId;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\TeamRonvau", inversedBy="userTeams")
     * @ORM\JoinColumn(nullable=false)
     */
    private $teamRonvauId;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"team_ronvau_read"})
     */
    private $isStaff;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"team_ronvau_read"})
     */
    private $isPlayer;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerMatch", mappedBy="idUserTeam", orphanRemoval=true)
     * @Groups({"team_ronvau_read"})
     */
    private $playerMatches;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PlayerTraining", mappedBy="idUserTeam")
     */
    private $playerTrainings;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Chat", mappedBy="sender")
     */
    private $chats;

    public function __construct()
    {
        $this->playerMatches = new ArrayCollection();
        $this->playerTrainings = new ArrayCollection();
        $this->chats = new ArrayCollection();
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

    public function getTeamRonvauId(): ?TeamRonvau
    {
        return $this->teamRonvauId;
    }

    public function setTeamRonvauId(?TeamRonvau $teamRonvauId): self
    {
        $this->teamRonvauId = $teamRonvauId;

        return $this;
    }

    public function getIsStaff(): ?bool
    {
        return $this->isStaff;
    }

    public function setIsStaff(bool $isStaff): self
    {
        $this->isStaff = $isStaff;

        return $this;
    }

    public function getIsPlayer(): ?bool
    {
        return $this->isPlayer;
    }

    public function setIsPlayer(bool $isPlayer): self
    {
        $this->isPlayer = $isPlayer;

        return $this;
    }

    /**
     * @return Collection|PlayerMatch[]
     */
    public function getPlayerMatches(): Collection
    {
        return $this->playerMatches;
    }

    public function addPlayerMatch(PlayerMatch $playerMatch): self
    {
        if (!$this->playerMatches->contains($playerMatch)) {
            $this->playerMatches[] = $playerMatch;
            $playerMatch->setIdUserTeam($this);
        }

        return $this;
    }

    public function removePlayerMatch(PlayerMatch $playerMatch): self
    {
        if ($this->playerMatches->contains($playerMatch)) {
            $this->playerMatches->removeElement($playerMatch);
            // set the owning side to null (unless already changed)
            if ($playerMatch->getIdUserTeam() === $this) {
                $playerMatch->setIdUserTeam(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|PlayerTraining[]
     */
    public function getPlayerTrainings(): Collection
    {
        return $this->playerTrainings;
    }

    public function addPlayerTraining(PlayerTraining $playerTraining): self
    {
        if (!$this->playerTrainings->contains($playerTraining)) {
            $this->playerTrainings[] = $playerTraining;
            $playerTraining->setIdUserTeam($this);
        }

        return $this;
    }

    public function removePlayerTraining(PlayerTraining $playerTraining): self
    {
        if ($this->playerTrainings->contains($playerTraining)) {
            $this->playerTrainings->removeElement($playerTraining);
            // set the owning side to null (unless already changed)
            if ($playerTraining->getIdUserTeam() === $this) {
                $playerTraining->setIdUserTeam(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Chat[]
     */
    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function addChat(Chat $chat): self
    {
        if (!$this->chats->contains($chat)) {
            $this->chats[] = $chat;
            $chat->setSender($this);
        }

        return $this;
    }

    public function removeChat(Chat $chat): self
    {
        if ($this->chats->contains($chat)) {
            $this->chats->removeElement($chat);
            // set the owning side to null (unless already changed)
            if ($chat->getSender() === $this) {
                $chat->setSender(null);
            }
        }

        return $this;
    }
}
