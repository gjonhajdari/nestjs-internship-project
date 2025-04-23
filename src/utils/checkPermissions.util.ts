export default (permissionNum, singlePermission) => {
  if ((permissionNum & singlePermission) === singlePermission) return true;
  return false;
};
