const fluigUserWithoutUserInfo = {
  sub: 'ambiele',
  role: 'user',
  tenant: 1,
  userTenantId: 2493,
  userType: 0,
  userUUID: 'e1ba52b3-5557-45eb-8f90-5fb9d327b757',
  tenantUUID: '788022ff-c186-4b6a-9714-a77532d210c7',
  lastUpdateDate: 1660736844819,
  userTimeZone: 'America/Sao_Paulo',
  userInfo: undefined,
};

const fluigUser = {
  ...fluigUserWithoutUserInfo,
  userInfo: {
    userName: 'Eric Ambiel',
    email: 'Eric.Ambiel@dematic.com',
    active: true,
    defaultLanguage: 'pt_BR',
    dialectId: 'pt_BR',
  },
};

export { fluigUser, fluigUserWithoutUserInfo };
