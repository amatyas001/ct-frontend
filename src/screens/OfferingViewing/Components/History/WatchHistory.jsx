import React, { useState, useEffect } from 'react'
import { VideoCard, PlaceHolder } from '../../../../components'
import { util, api, prompt } from '../../../../utils'

export default function WatchHistory({ 
  offerings, 
}) {

  const [watchHistory, setWatchHistory] = useState(['unloaded'])

  const getMediaById = async mediaId => {
    let { data } = await api.getMediaById(mediaId)
    return api.parseMedia(data)
  }

  const getUserWatchHistories = async () => {
    try {
      let { data } = await api.getUserWatchHistories()
      for (let i = 0; i < data.length; i++) {
        data[i] = await getMediaById(data[i].mediaId)
      }
      setWatchHistory(data)
    } catch (error) {
      setWatchHistory([])
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' })
    }
  }

  useEffect(() => {
    getUserWatchHistories()
  }, [])


  return (
    <div className="watch-history">
      <h2 className="history-title">
        <i className="material-icons">history</i>
        <span>Watch History</span>
      </h2>
      {
        (watchHistory.length === 0 || offerings[0] === 'retry')  
        ?
        <div>None</div> 
        :
        (watchHistory[0] === 'unloaded' || offerings[0] === 'Unloaded') 
        ?
        <PlaceHolder /> 
        :
        <div role="list" className="ct-list-col ct-a-fade-in">
          {watchHistory.map(media => (
            <MediaItem 
              key={'watchhistory-' + media.id} 
              media={media} 
              offerings={offerings} 
            />
          ))}
        </div>
      }
    </div>
  )
}

function MediaItem({ media }) {
  const { mediaName, watchHistory, id } = media
  return (
    <VideoCard row
      name={mediaName}
      ratio={watchHistory.ratio}
      role="listitem"
      posterSize="200px"
      link={util.links.watch(id)}
      //description={`${fullNumber} • ${courseName}`}
      //descriptionLink={util.links.offeringDetail(offeringId)}
      //descriptionState={{ from: 'history' }}
    />
  )
}