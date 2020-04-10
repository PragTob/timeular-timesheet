import React, { useState } from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core/styles'

import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const IndexPage = () => {

  const classes = useStyles()

  // Moving to timeular API module

  const BASE_TIMEULAR_API_URL = "https://api.timeular.com/api/v2"

  const fetchActivites = async (token) => {
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/activities`, {
      headers: apiHeaders(token),
      method: "GET"
    });
    const json = await response.json();
    const { activities } = json;

    return activities;
  }

  const apiHeaders = (token) => {
    return {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }

  const getAccessToken = async (key, secret) => {
    const data = {
      apiKey: key,
      apiSecret: secret
    };
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/developer/sign-in`, {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST"
    });
    const json = await response.json();
    const { token } = json;

    return token;
  }

  const fetchTimeEntries = async (token, from, until) => {
    const stoppedAfter = `${from}T00:00:00.000`;
    const startedBefore = `${until}T23:59:59.999`;

    const response = await fetch(`${BASE_TIMEULAR_API_URL}/time-entries/${stoppedAfter}/${startedBefore}`, {
      headers: apiHeaders(token),
      method: "GET"
    });

    const json = await response.json();
    console.log(json);

    const { timeEntries } = json;

    return timeEntries;
  }

  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState(null);

  const [fromDate, setFromDate] = useState(null);
  const [untilDate, setUntilDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);


  const [activities, setActivities] = useState(null);
  const [timeEntries, setTimeEntries] = useState(null);


  const handleActivityChecked = (event, id) => {
    if (event.target.checked) {
      setSelectedActivities(
        selectedActivities => [...selectedActivities, id]
      )
    }
    else {
      setSelectedActivities(
        selectedActivities.filter((someId) => { return someId !== id; }));
    }
  }

  const LOCAL_STORAGE_TOKEN_KEY = "accessToken";

  // should handleSubmit be async and call out to await? Probably not, we'd likely need a load state
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting");
    if (!accessToken) {
      const token = await retrieveAccessToken(apiKey, apiSecret);
      //  doesn't set token immediately?
      setAccessToken(token);
      // conditional check for safari private mode? Plus make saving optional?
      window.localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
      // console.log(`access Token inside ${accessToken}`);
    }

    // console.log(`access Token ${accessToken}`);

    activities || setActivities(await fetchActivites(accessToken));
    timeEntries || setTimeEntries(await fetchTimeEntries(accessToken, fromDate, untilDate))
  }

  const retrieveAccessToken = async (apiKey, apiSecret) => {
    return window.localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) ||
      await getAccessToken(apiKey, apiSecret);
  }

  return (
    <Layout>
      <SEO title="Home" />
      <p>
        Get your time sheet from your <a href="https://timeular.com/">Timeular</a> time tracking.
      </p>

      <p>
        Useful for invoicing or others.
      </p>

      <p>Blablablabla how to get your API key etc. blablablabalabla we have full access now</p>

      {/* TODO: WHat does classes.root do? */}
      <form className={classes.root} noValidate onSubmit={handleSubmit} >
        <div>

          {/* grey out/disable if key is loaded from local storage/give way to clear key */}
          <TextField label="API Key" variant="outlined" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <TextField label="API Secret" variant="outlined" value={apiSecret} onChange={e => setApiSecret(e.target.value)} />
        </div>

        {/* Time from time until */}

        <TextField
          label="From"
          type="date"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setFromDate(e.target.value)}
        />

        <TextField
          label="Until"
          type="date"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => setUntilDate(e.target.value)}
        />

        {/* activity component */}
        {/* {console.log(activities)} */}
        <div>
          {(activities || []).map(({ id, name, color }) => {
            const myStyle = { color: color };
            return <FormControlLabel
              key={id}
              control={
                <Checkbox style={myStyle} />
              }
              label={name}
              onChange={e => handleActivityChecked(e, id)}
            />;
          })}
        </div>

        {/* Restrict to activity */}

        <Button variant="contained" color="primary" type="submit">Fetch Activities</Button>
      </form>

      <div>
        <ul>
          {(timeEntries || []).map(({ id, activity, duration }) => {
            return <li key={id}>{activity.name}: {duration.startedAt} - {duration.stoppedAt} </li>
          })}
        </ul>
      </div>

      {/* generate report */}

      {/* print report */}

    </Layout >
  )
}

export default IndexPage
