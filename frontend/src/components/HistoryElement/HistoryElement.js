import React from 'react';
import classNames from 'classnames';
import './HistoryElement.scss';
import Checkbox from '../Checkbox/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const HistoryElement = ({ 
  id, 
  name, 
  value, 
  time,
  imgAsset,
}) => {
  const contClasses = classNames('contain');
  const timeClasses = classNames('time');
  const sectionClasses = classNames('section');
  const imageClasses = classNames('image');
  const assetnameClasses = classNames('assetName');
  const valueClasses = classNames('downloadValue');
  const downloadiconClasses = classNames('downloadIcon');


  return (
    <div className={contClasses}>
      <span className={timeClasses}>{time}</span>
      <section className={sectionClasses}>
        <Checkbox label="Check" size="normal" showLabel={false} id={`chk-${id}`}/>
          {imgAsset && <img src={imgAsset} alt={`${name}`} className={imageClasses}/>}
        <span className={assetnameClasses}>{name}</span>
        <span className={valueClasses}>{value}</span>
        {imgAsset && (
          <a href={imgAsset} download={name} className={downloadiconClasses}>
            <FontAwesomeIcon icon={faDownload} />
          </a>
        )}
      </section>
    </div>
  );
};

export default HistoryElement;