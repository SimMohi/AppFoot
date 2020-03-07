<?php

namespace App\Repository;

use App\Entity\TeamRonvau;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method TeamRonvau|null find($id, $lockMode = null, $lockVersion = null)
 * @method TeamRonvau|null findOneBy(array $criteria, array $orderBy = null)
 * @method TeamRonvau[]    findAll()
 * @method TeamRonvau[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TeamRonvauRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TeamRonvau::class);
    }

    // /**
    //  * @return TeamRonvau[] Returns an array of TeamRonvau objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TeamRonvau
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
