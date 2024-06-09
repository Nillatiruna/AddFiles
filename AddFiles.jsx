import { useMemo } from 'react';
import { getFileTypeLabels, validateFiles } from './AddFiles.service';
import classes from './AddFiles.module.css';
import { TooltipBox } from '../TooltipBox/TooltipBox';
import { TiDeleteOutline } from 'react-icons/ti';
import { shrinkString } from '../../utils/global.services';
import { TooltipPlacement } from '../TooltipBox/TooltipBox.service';

export const AddFiles = ({
  files,
  setAttachments,
  setAlert,
  loading,
  filesLimit = 1,
  fileTypes = ['jpg', 'jpeg', 'gif', 'png', 'pdf', 'csv'],
  id,
  containerClassName = '',
  children
}) => {
  const acceptedTypes = useMemo(() => `.${fileTypes.join(', .')}`, [fileTypes]);

  const getFile = (e) => {
    if (!e.target?.files?.length) return;

    validateFiles({
      addedFiles: e.target.files,
      files,
      setAlert,
      setAttachments,
      fileTypes,
      filesLimit
    });
    e.target.value = '';
  };

  return (
    <div className={containerClassName}>
      <input
        onChange={getFile}
        type="file"
        multiple
        id={id}
        accept={acceptedTypes}
        disabled={loading}
        className={classes.uploadInput}
      />
      <label htmlFor={id} className={classes.uploadLabel}>
        <TooltipBox
          text={`You can attach ${filesLimit} file${
            filesLimit > 1 ? 's' : ''
          }: ${getFileTypeLabels(fileTypes)} up to 5 Mb.`}
          placement={TooltipPlacement.TOP}
        >
          <span>{children}</span>
        </TooltipBox>
      </label>
    </div>
  );
};

export const AddFilesList = ({
  files,
  setAttachments,
  containerClassName = ''
}) => {
  const deleteFile = (e) => {
    const fileIndex = +e.currentTarget.getAttribute('data-index');
    setAttachments(files.filter((file, i) => i !== fileIndex));
  };

  return (
    <div className={containerClassName}>
      <div className={classes.attachedBox}>
        {files.map((file, i) => (
          <p className={classes.attachedFile} key={`attachment-${i}`}>
            {file.name.length > 20 ? (
              <TooltipBox text={file.name}>
                <span>{shrinkString(file.name, 16)}</span>
              </TooltipBox>
            ) : (
              shrinkString(file.name, 16)
            )}
            <TiDeleteOutline
              data-index={i}
              onClick={deleteFile}
              className={classes.attachedDeleteIcon}
            />
          </p>
        ))}
      </div>
    </div>
  );
};
