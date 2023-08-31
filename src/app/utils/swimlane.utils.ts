export const swimlaneTitles = [
  'backlog',
  'rdy 2 start',
  'blocked',
  'in progress',
  'done',
];

export const getLanePageNumberTitleFromLane = {
  'backlog': 'backlogLanePageNumber',
  'rdy 2 start': 'rdy2StartLanePageNumber',
  'blocked': 'blockedLanePageNumber',
  'in progress': 'inProgressLanePageNumber',
  'done': 'doneLanePageNumber',
};

export const getLanePageNumberFromLane = (
  backlogLanePageNumber: string,
  rdy2StartLanePageNumber,
  blockedLanePageNumber,
  inProgressLanePageNumber,
  doneLanePageNumber
) => {
  {
    return {
      'backlog': backlogLanePageNumber,
      'rdy 2 start': rdy2StartLanePageNumber,
      'blocked': blockedLanePageNumber,
      'in progress': inProgressLanePageNumber,
      'done': doneLanePageNumber,
    };
  }
};
