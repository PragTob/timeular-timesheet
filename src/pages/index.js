import React, { useState } from 'react'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { makeStyles } from '@material-ui/core/styles'

import { Button, TextField } from '@material-ui/core'

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
    console.log("doing request");
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/activities`, {
      headers: apiHeaders(token),
      method: "GET"
    });
    console.log("waiting for json");
    const json = await response.json();
    console.log(json);
    const { activities } = json;

    return activities;
  }

  const apiHeaders = (token) => {
    return {
      "content-type": "application/json",
      "Authorizaiton": `Bearer ${token}`
    }
  }

  const getAccessToken = async (key, secret) => {
    const data = {
      apiKey: key,
      apiSecret: secret
    };
    console.log("doing request");
    const response = await fetch(`${BASE_TIMEULAR_API_URL}/developer/sign-in`, {
      headers: {
        "content-type": "application/json",
      },
      body: data,
      method: "POST"
    });
    console.log("waiting for json");
    const json = await response.json();
    console.log(json);
    const { token } = json;

    return token;
  }

  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [activities, setActivities] = useState(null);


  // should handleSubmit be async and call out to await? Probably not, we'd likely need a load state
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting");
    console.log(apiKey);
    //  where to store/get access token from?
    if (!accessToken) {
      // await?
      setAccessToken(await getAccessToken(apiKey, apiSecret));
    }


    accessToken || setAccessToken(await getAccessToken(apiKey, apiSecret));
    activities || setActivities(await fetchActivites(accessToken));
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
          <TextField label="API Key" variant="outlined" value={apiKey} onChange={e => setApiKey(e.target.value)} />
          <TextField label="API Secret" variant="outlined" value={apiSecret} onChange={e => setApiSecret(e.target.value)} />
        </div>

        {/* Time from time until */}

        {/* activity component */}
        {console.log(activities)}
        {(activities || []).map(({ id, name }) => { return 1; })}

        {/* Restrict to activity */}

        <Button variant="contained" color="primary" type="submit">Fetch Activities</Button>
      </form>

      {/* generate report */}

      {/* print report */}

    </Layout>
  )
}

export default IndexPage
