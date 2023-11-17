import "./HomePage.scss";
import Logo from "../../assets/logo/logo.svg";
import Search from "../../assets/icons/Search.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import ContributorCommits from "../../components/ContributorCommits/ContributorCommits";

function HomePage() {

  const manager = 'Jordan Smith'

  const owner = "Nicolas7Chaves";
  const repo = "instock-back-end";

  // const owner = "expressjs";
  // const repo = "express";

  const token = "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";

  const [stats, setStats] = useState([]);
  const [dateStatistics, setDateStatistic] = useState([]);
  const [codeStatistics, setCodeStatistic] = useState([]);

  const [totalPullRequests, setTotalPullRequests] = useState(0);
  const [totalMerges, setTotalMerges] = useState(0);

  const [totalInsertions, setTotalInsertions] = useState(0);
  const [totalDeletions, setTotalDeletions] = useState(0);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const newStats = [];
        const dateStats = [];
        const codeStats = [];

        //calculate total merge requests and total pull requests
        response.data.forEach((item) => {
          if (item.commit.committer.name === 'GitHub') {
            setTotalMerges(prevTotal => prevTotal + 1);
          } else {
            setTotalPullRequests(prevTotal => prevTotal + 1);
          }
        });

        // create and update author statistics object-format: (author, authorMergeRequests, authorPullRequests)
        response.data.forEach((item) => {
          const author = item.commit.author.name;
          const commitMessage = item.commit.message;
          const isMerge = commitMessage.includes('Merge pull request');

          // check if the author's stats already exist
          const existingStatsIndex = newStats.findIndex(stat => stat.author === author);

          if (existingStatsIndex === -1) {
            // if doesn't exist, create new stats
            newStats.push({
              author,
              numPullRequests: item.commit.committer.name !== 'GitHub' ? 1 : 0,
              numMerges: isMerge ? 1 : 0,
            });

          } else {
            // if exists, update the existing stats
            newStats[existingStatsIndex].numPullRequests += item.commit.committer.name !== 'GitHub' ? 1 : 0;
            newStats[existingStatsIndex].numMerges += isMerge ? 1 : 0;
          }
        });
        setStats(newStats);

        // create and update date statistics object-format: (date, total merge requests, total pull requests)
        response.data.forEach((item) => {
          const date = (item.commit.committer.date).split('T')[0];
          const commitMessage = item.commit.message;
          const isMerge = commitMessage.includes('Merge pull request');

          const existingStatsIndex = dateStats.findIndex(stat => stat.date === date);

          if (existingStatsIndex === -1) {
            dateStats.push({
              date,
              numPullRequests: item.commit.committer.name !== 'GitHub' ? 1 : 0,
              numMerges: isMerge ? 1 : 0
            })
          } else {
            dateStats[existingStatsIndex].numPullRequests += item.commit.committer.name !== 'GitHub' ? 1 : 0;
            dateStats[existingStatsIndex].numMerges += isMerge ? 1 : 0;
          }
        });
        setDateStatistic(dateStats);

        const promises = response.data.map(async (item) => {
          const id = item.sha;

          try {
            const data = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            setTotalDeletions(prevTotal => prevTotal + data.data.stats.deletions);
            setTotalInsertions(prevTotal => prevTotal + data.data.stats.additions);

            const author = data.data.commit.author.name;
            const commitMessage = data.data.commit.message;
            const isMerge = commitMessage.includes('Merge pull request');

            const existingStatsIndex = codeStats.findIndex(stat => stat.author === author);

            if (existingStatsIndex === -1) {
              codeStats.push({
                author,
                mergeDeletions: (isMerge) ? data.data.stats.deletions : 0,
                mergeAdditions: (isMerge) ? data.data.stats.additions : 0,
                pullRequestDeletions: (!isMerge) ? data.data.stats.deletions : 0,
                pullRequestAdditions: (!isMerge) ? data.data.stats.additions : 0,
              })
            } else {
              codeStats[existingStatsIndex].mergeDeletions += (isMerge) ? data.data.stats.deletions : 0;
              codeStats[existingStatsIndex].mergeAdditions += (isMerge) ? data.data.stats.additions : 0;
              codeStats[existingStatsIndex].pullRequestDeletions += (!isMerge) ? data.data.stats.deletions : 0;
              codeStats[existingStatsIndex].pullRequestAdditions += (!isMerge) ? data.data.stats.additions : 0;
            }

          } catch (error) {
            console.error('Error fetching commits:', error);
          }
        });

        await Promise.all(promises);

        setCodeStatistic(codeStats);

      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };

    fetchCommits();
  }, [])

  const findAuthor = (author) => {
    return codeStatistics.filter((item) => {
      //console.log(item);
      return item.author === author;
    })
  }

  console.log('state: ', stat.author)

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-bar__bar">
          <img src={Logo} alt={`Logo that represent the company Kaseya`} />

          <input
            className="nav__bar--input"
            required
            placeholder="repo:dige91/instock"
          />
          <img className="search__image" src={Search} alt="" />
        </div>
      </nav>
      <main>
        <div className="main__container">
          <section className="repo__info">
            <div className="repo__info-container">
              <div className="repo__manager"><span className="repo__manager-text">{manager[0]}</span></div>
              <p className="repo__manager--name">Hello, {manager}</p>
            </div>
            <div>
              <h3 className="repo__title">Dige91/instock</h3>
            </div>
          </section>
          <section className="repo__details">
            <div className="repo__detail">
              <h3>DETAILS</h3>
              <div className="repo__container">
                <h4>Total commits: </h4>
                <span>{totalPullRequests + totalMerges}</span>
              </div>
              <div className="repo__container">
                <h4>Pull Requests: </h4>
                <span>{totalPullRequests}</span>
              </div>
              <div className="repo__container">
                <h4>Merges: </h4>
                <span>{totalMerges}</span>
              </div>
            </div>
            <div className="repo__detail">
              <h3>CODE INSIGHTS</h3>
              <div className="repo__container">
                <h4>Total Additions: </h4>
                <span>{totalInsertions}</span>
              </div>
              <div className="repo__container">
                <h4>Total Deletions: </h4>
                <span>{totalDeletions}</span>
              </div>
            </div>
            <div className="repo__detail"></div>
            <div className="repo__detail"></div>
          </section>
        </div>
        <section className="repo__contributors">
          <h3>CONTRIBUTOR COMMITS</h3>
          {
            // stats.map((stat, index) => ( <ContributorCommits key={index} contributor={stat} stats={findAuthor(stat.author)} totalPullRequests={totalPullRequests} totalMerges={totalMerges}/> ) )
          }
        </section>
      </main>
    </>
  );
}

export default HomePage;
