<?php

namespace App\Repository;

use App\Entity\NewCompet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method NewCompet|null find($id, $lockMode = null, $lockVersion = null)
 * @method NewCompet|null findOneBy(array $criteria, array $orderBy = null)
 * @method NewCompet[]    findAll()
 * @method NewCompet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class NewCompetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, NewCompet::class);
    }

    // /**
    //  * @return NewCompet[] Returns an array of NewCompet objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('n.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?NewCompet
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
