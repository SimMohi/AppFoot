<?php

namespace App\Repository;

use App\Entity\PlayerMatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method PlayerMatch|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlayerMatch|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlayerMatch[]    findAll()
 * @method PlayerMatch[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlayerMatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlayerMatch::class);
    }

    // /**
    //  * @return PlayerMatch[] Returns an array of PlayerMatch objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PlayerMatch
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
