<?php

namespace App\Repository;

use App\Entity\UnOfficialMatch;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UnOfficialMatch|null find($id, $lockMode = null, $lockVersion = null)
 * @method UnOfficialMatch|null findOneBy(array $criteria, array $orderBy = null)
 * @method UnOfficialMatch[]    findAll()
 * @method UnOfficialMatch[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UnOfficialMatchRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UnOfficialMatch::class);
    }

    // /**
    //  * @return UnOfficialMatch[] Returns an array of UnOfficialMatch objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UnOfficialMatch
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
