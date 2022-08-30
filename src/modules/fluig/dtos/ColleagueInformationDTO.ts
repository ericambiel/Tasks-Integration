export type ColleagueInformationDTO = {
  content: {
    colleaguePK: {
      companyId: number;
      colleagueId: string;
    };
    userTenantId: number;
    colleagueName: string;
    mail: string;
    extensionNr: null;
    currentProject: string;
    especializationArea: null;
    login: string;
    passwd: string;
    active: boolean;
    homePage: null;
    photoPath: null;
    area1Id: null;
    area2Id: null;
    area3Id: null;
    area4Id: null;
    area5Id: null;
    emailHtml: boolean;
    adminUser: boolean;
    nominalUser: null;
    groupId: string;
    sessionId: null;
    defaultLanguage: string;
    dialectId: string;
    volumeId: null;
    background: null;
    maxPrivateSize: null;
    usedSpace: number;
    workflowRoles: null;
    hasPrivateDocuments: null;
    colleagueGroups: null;
    guestUser: null;
    lastAccess: null;
  };
  message: null;
};
