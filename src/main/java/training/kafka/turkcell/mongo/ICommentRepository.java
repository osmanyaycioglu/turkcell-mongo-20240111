package training.kafka.turkcell.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface ICommentRepository extends MongoRepository<Comment,String> {
}
