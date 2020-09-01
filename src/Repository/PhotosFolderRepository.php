<?php

namespace App\Repository;

use App\Entity\PhotosFolder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PhotosFolder|null find($id, $lockMode = null, $lockVersion = null)
 * @method PhotosFolder|null findOneBy(array $criteria, array $orderBy = null)
 * @method PhotosFolder[]    findAll()
 * @method PhotosFolder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PhotosFolderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PhotosFolder::class);
    }

    // /**
    //  * @return PhotosFolder[] Returns an array of PhotosFolder objects
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
    public function findOneBySomeField($value): ?PhotosFolder
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
