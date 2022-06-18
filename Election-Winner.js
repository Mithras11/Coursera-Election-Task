/*
    Problem statement
    In an election, a single winner is chosen from a collection of ballots.
    In this case, a ballot is a list of candidates (strings), ordered by preference.

    Example: the ballot [A, B, C] selects candidate A as the 1st choice, B as the 2nd, and C as the 3rd.

    Part I: Plurality Winner

    In this part, the winner is the candidate with the most 1st choice votes.

    Example: if we receive 4 ballots [A, B, C], 3 ballots [B, C, A], and 2 ballots [C, B, A],
    then A has received 4 first-choice votes, B has received 3, and C has received 2.
    Out of the candidates, A has received the most votes. Therefore, A is the plurality winner.

    Part 2: Ranked choice winner

    In this part, the winner is chosen as follows:

    Step 1: if a single candidate has a strict majority (more than half) of 1st-choice votes, they are the winner.

    Step 2: if no candidate has a strict majority of 1st-choice votes,
    identify the candidate with the fewest 1st-choice votes and eliminate them
    from all ballots (and remove any empty ballots). Then, go back to Step 1 and re-evaluate.

    Example: if we receive 4 ballots [A, B, C], 3 ballots [B, C, A], and 2 ballots [C, B, A],
    then A has received 4 first-choice votes, B has received 3, and C has received 2. 
    There are 9 ballots in total, and no candidate has received a majority (at least 5) of the votes, 
    so we eliminate the candidate with the fewest 1st-choice votes, C.
    After eliminating C, we have 4 ballots [A, B] and 5 ballots [B, A]. 
    Out of these 9 ballots, B has received a majority of the votes, so B is the ranked choice winner.
*/

//const sample = { "A,B,C": 2, "A,C,B": 2, "B,A,C": 3 };        //=> pluratlity A, ranked A
//const sample = { "A,B,C": 4, "B,C,A": 3, "C,B,A": 2 };        //=> pluratlity A, ranked B           
//const sample = { "B,A": 2, "A,B": 2 };                        //=> pluratlity A, ranked A  
//const sample = { "A,B": 5, "B": 4, "C": 3, "D": 2 };          //=> pluratlity A, ranked A
const sample = { "B,A,C,D": 1, "C,A,B,D": 1, "D,A,B,C": 1 }   //=> pluratlity B, ranked B

// Determine plurality winner (Part 1)
console.log("The plurality winner is: " + getPluralityWinner(sample));

// Determine ranked choice winner (Part 2)
console.log("The ranked choice winner is: " + getRankedChoiceWinner(sample));

//implement this method for Part 1
function getPluralityWinner(ballots) {
    let filteredBallots = filterBallots(ballots);
    let maxVotes = Math.max(...Object.values(filteredBallots));
    let majorityArr = filterMarginals(filteredBallots, maxVotes);
    return majorityArr[0];
}

//implement this method for Part 2
function getRankedChoiceWinner(ballots) {
    while (Object.keys(ballots).length > 2) {
        let halfOfVotes = Object.values(ballots).reduce((a, v) => a + v) / 2;
        let filteredBallots = filterBallots(ballots);

        let winner = Object.keys(filteredBallots).find(key => filteredBallots[key] > halfOfVotes);
        if (winner !== undefined) {
            return winner[0];
        }

        let min = Math.min(...Object.values(ballots));
        let minorityArr = filterMarginals(ballots, min);

        let loser;
        for (let key in ballots) {
            for (let i = 0; i < key.length; i++) {
                if (!Object.keys(filteredBallots).includes(key[i])) {
                    loser = key[i];
                    break;
                }
            }
            if (loser) {
                break;
            }
        };

        if (!loser) {
            loser = minorityArr[minorityArr.length - 1][0];
        }

        let regExp1 = `${loser},`;
        let regExp2 = `,${loser}`;

        let newKey;
        Object.keys(ballots).forEach(key => {
            if (key.includes(regExp1)) {
                newKey = key.replace(regExp1, '');
            } else if (key.includes(regExp2)) {
                newKey = key.replace(regExp2, '');
            } else {
                newKey = key.replace(loser, '');
            }

            if (newKey !== key) {
                if (newKey === '') {
                    delete ballots[key];
                    return;
                }

                if (ballots[newKey]) {
                    ballots[newKey] += ballots[key];
                } else {
                    ballots[newKey] = ballots[key];
                }

                delete ballots[key];
            }
        });
    }
    return getPluralityWinner(ballots);
}

function filterBallots(sample) {
    return Object.keys(sample).reduce((acc, val) => {
        if (acc[val[0]]) {
            acc[val[0]] += sample[val];
        } else {
            acc[val[0]] = sample[val];
        }
        return acc;
    }, {});
}

function filterMarginals(sample, votes) {
    let result = Object.keys(sample).reduce((acc, key) => {
        if (sample[key] === votes) {
            acc.push(key);
        }
        return acc;
    }, []);

    if (result.length > 1) {
        result.sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
    }
    return result;
}
