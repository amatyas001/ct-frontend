import React from 'react'
import { isMobile } from 'react-device-detect'
import { Popup } from 'semantic-ui-react'

import Placeholder from '../Placeholder'
import OpenMenuButton from './OpenMenuButton'
import PageControlButtons from './PageControlButtons'
import { VideoListItem, ShortcutListItem, CaptionListItem } from './ResultListItems'
import Accordion from '../Accordion'

import { 
  searchControl,
  SEARCH_INIT, 
  WEBVTT_DESCRIPTIONS, 
  SEARCH_TRANS_IN_VIDEO, 
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS,
  ARRAY_INIT,
  SEARCH_IN_SHORTCUTS,
  MENU_SHORTCUTS,
  MENU_PLAYLISTS,
} from '../../../Utils'

function ResultList({
  option=SEARCH_TRANS_IN_VIDEO,
  search=SEARCH_INIT,
  page=1,
  nextPage=null,
  prevPage=null,
}) {
  const { 
    inVideoTransResults, 
    inCourseTransResults, 
    playlistResults,
    shortcutResults,
    value
  } = search

  const results = option === SEARCH_TRANS_IN_VIDEO ? inVideoTransResults 
                : option === SEARCH_TRANS_IN_COURSE ? inCourseTransResults 
                : option === SEARCH_IN_SHORTCUTS ? shortcutResults
                : playlistResults

  const popupContent = item => {
    if (isMobile) return undefined
    switch (option) {
      case SEARCH_TRANS_IN_VIDEO:
        return `Seek to this ${item.kind === WEBVTT_DESCRIPTIONS ? 'description' : 'caption'}`
      case SEARCH_TRANS_IN_COURSE:
        return <>Watch this caption in video <i>{item.mediaName}</i></>
      case SEARCH_IN_PLAYLISTS:
        return <>Watch video {item.mediaName}</>
      default:
        return undefined
    }
  }

  const totalPage = searchControl.totalPageNum(results.length)

  const resultsEachItems = (
    <div role="list" className="w-100 d-flex flex-column">
      {results.map( (item, index) => searchControl.isInCurrentPage(page, index) ? (
        <Popup inverted wide basic hideOnScroll 
          position="top left"
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          disabled={option === SEARCH_IN_SHORTCUTS}
          key={`search-result-#${index}`}
          content={popupContent(item)}
          trigger={
            option === SEARCH_IN_PLAYLISTS ? // Video results are special
            <VideoListItem media={item} />
            :
            option === SEARCH_IN_SHORTCUTS ?
            <ShortcutListItem key={item.action} row={item} />
            :
            <CaptionListItem item={item} option={option} />
          }
        />
      ) : null)}
    </div>
  )

  const [inVideoTransResultsEarlier, inVideoTransResultsLater] = 
    option === SEARCH_TRANS_IN_VIDEO ? inVideoTransResults.map(result => 
      (
        <div role="list" className="w-100 d-flex flex-column">
          {result.map( (item, index) => (
            <Popup inverted wide basic hideOnScroll 
              position="top left"
              openOnTriggerClick={false}
              openOnTriggerFocus
              closeOnTriggerBlur
              disabled={option === SEARCH_IN_SHORTCUTS}
              key={`search-result-#${index}`}
              content={popupContent(item)}
              trigger={<CaptionListItem item={item} option={option} />}
            />
          ))}
        </div>
      ) 
    )
    :
    [null, null]

  const [itemsNumEarlier, itemNumLater] = inVideoTransResults.map(result => result.length)
  
  const transResultsItemsData = [
    {
      item: inVideoTransResultsEarlier,
      length: itemsNumEarlier,
      type: 'earlier'
    },
    {
      item: inVideoTransResultsLater,
      length: itemNumLater,
      type: 'later'
    }
  ]

  const transResultsItems = 
  transResultsItemsData
    .filter(transItem => transItem.length !== 0)
    .map(transItem => 
      <Accordion 
        resultsEachItems = {transItem.item}
        title = {`${transItem.length} ${transItem.type} captions in this video`}
      />
    )

  return (
    <div className="search-result-list">
      {
        results === ARRAY_INIT ?
        <Placeholder />
        :
        <>
          <PageControlButtons isTop
            page={page}
            totalPage={totalPage}
            nextPage={nextPage}
            prevPage={prevPage}
            value={value}
            resultsNum={results.length}
          />

          <OpenMenuButton
            show={option === SEARCH_IN_SHORTCUTS}
            menu={MENU_SHORTCUTS}
            name="shortcuts"
          />

          <OpenMenuButton
            show={option === SEARCH_IN_PLAYLISTS}
            menu={MENU_PLAYLISTS}
            name="playlists"
          />

          {/* The Result list */}
          {option === SEARCH_TRANS_IN_VIDEO ? transResultsItems : resultsEachItems}
          
          <PageControlButtons
            page={page}
            totalPage={totalPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </>
      }
    </div>
  )
}

export default ResultList