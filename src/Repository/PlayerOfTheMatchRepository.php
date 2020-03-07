<?php

namespace App\Repository;

use App\Entity\PlayerOfTheMatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method PlayerOfTheMatch|null find($id, $lockMode = null, $lockVersion = null)
 * @method PlayerOfTheMatch|null findOneBy(array $criteria, array $orderBy = null)
 * @method PlayerOfTheMatch[]    findAll()
 * @method PlayerOfTheMatch[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlayerOfTheMatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PlayerOfTheMatch::class);
    }

    // /**
    //  * @return PlayerOfTheMatch[] Returns an array of PlayerOfTheMatch objects
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
    public function findOneBySomeField($value): ?PlayerOfTheMatch
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
