CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- status
-- 1 - pending
-- 2 - accepted
-- 3 - canceled
-- 4 - terminated
-- 5 - rejected

UPDATE friendships SET status = 2 WHERE
(sender_id = $1 AND receiver_id = $2)


SELECT * FROM friendships
WHERE ((sender_id=$1 AND receiver_id =$2)
OR sender_id=$2 AND receiver_id=$1)
