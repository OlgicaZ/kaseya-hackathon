import { useEffect, useState } from "react";
import "./ContributorCommits.scss";
function ContributorCommits({ contributor, stats, totalPullRequests, totalMerges }) {
 
    const [author, setAuthor] = useState('');
    const [pullRequests, setPullRequests] = useState('');
    const [merges, setMerges] = useState('');
    const [commits, setCommits] = useState('');
    const [pullRequestsFrequency, setPullRequestsFrequency] = useState(0);
    const [mergesFrequency, setMergesFrequency] = useState(0);
    const [codeAdditions, setCodeAdditions] = useState(0);
    const [codeDeletions, setCodeDeletions] = useState(0);

    
    useEffect(() => {
        if (!stats || stats.length === 0) {
            // Handle the case when stats is empty

            return
        }
        setAuthor(contributor?.author);
        setPullRequests(contributor?.numPullRequests);
        setMerges(contributor?.numMerges);
        contributor && setCommits(pullRequests + merges);
        contributor && setPullRequestsFrequency((pullRequests) ? (pullRequests / totalPullRequests).toFixed(2) : 0);
        contributor && setMergesFrequency((merges) ? (merges / totalMerges).toFixed(2) : 0);
        console.log('stats: ', stats)
        setCodeAdditions(stats[0]?.mergeAdditions + stats[0]?.pullRequestAdditions);
        setCodeDeletions(stats[0]?.mergeDeletions + stats[0]?.pullRequestDeletions);
    }, [])

    useEffect(() => {
        setCodeAdditions(stats[0]?.mergeAdditions + stats[0]?.pullRequestAdditions);
        setCodeDeletions(stats[0]?.mergeDeletions + stats[0]?.pullRequestDeletions);
    }, stats[0])

    return (
        <section className="contributor">
            <div className="contributor__container">
                <div className="contributor__image">{author[0]}</div>
            </div>
            <div className="contributor__container">
                <p className="contributor__name">{author}</p>
            </div>
            <div className="contributor__container">
                <h5 className="contributor__label">COMMITS</h5>
                <p className="contributor__text">{commits}</p>
            </div>
            <div className="contributor__container">
                <h5 className="contributor__label">PULL REQUESTS</h5>
                <p className="contributor__text">{pullRequests}</p>
            </div>
            <div className="contributor__container">
                <h5 className="contributor__label">PULL REQUESTS FREQUENCY</h5>
                <p className="contributor__text">{pullRequestsFrequency}</p>
            </div>
            <div className="contributor__container">
                <h5 className="contributor__label">MERGES</h5>
                <p className="contributor__text">{merges}</p>
            </div>
            <div className="contributor__container">
                <h5 className="contributor__label">MERGES FREQUENCY</h5>
                <p className="contributor__text">{mergesFrequency}</p>
            </div>
            <div className="contributor__container">
                <p className="contributor__text">++ {codeAdditions}</p>
            </div>
            <div className="contributor__container">
                <p className="contributor__text">{codeDeletions} --</p>
            </div>
            <div className="contributor__status-container">
            </div>
        </section>
    );
}
export default ContributorCommits;