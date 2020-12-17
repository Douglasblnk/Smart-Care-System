-- duasrodas.Atividades definition

CREATE TABLE `Atividades` (
  `idAtividades` int(11) NOT NULL AUTO_INCREMENT,
  `activityId` varchar(60) NOT NULL,
  `usuario` varchar(60) NOT NULL,
  `cracha` varchar(45) NOT NULL,
  `email` varchar(60) NOT NULL,
  `data` varchar(30) NOT NULL,
  `descricao` varchar(200) DEFAULT 'no description',
  PRIMARY KEY (`idAtividades`),
  UNIQUE KEY `idAtividades_UNIQUE` (`idAtividades`)
) ENGINE=InnoDB AUTO_INCREMENT=8348 DEFAULT CHARSET=utf8;


-- duasrodas.Causa definition

CREATE TABLE `Causa` (
  `idCausa` int(11) NOT NULL AUTO_INCREMENT,
  `descricaoCausa` varchar(45) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idCausa`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;


-- duasrodas.Centro_Trabalho definition

CREATE TABLE `Centro_Trabalho` (
  `id_centro_trabalho` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(150) CHARACTER SET utf8 NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_centro_trabalho`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_german2_ci;


-- duasrodas.Defeito definition

CREATE TABLE `Defeito` (
  `idDefeito` int(11) NOT NULL AUTO_INCREMENT,
  `descricaoDefeito` varchar(250) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idDefeito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- duasrodas.Epi definition

CREATE TABLE `Epi` (
  `idEpi` int(11) NOT NULL AUTO_INCREMENT,
  `descricaoEpi` varchar(200) NOT NULL,
  `icon` varchar(170) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idEpi`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;


-- duasrodas.Lista_operacao definition

CREATE TABLE `Lista_operacao` (
  `id_lista_operacao` int(11) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(180) NOT NULL,
  PRIMARY KEY (`id_lista_operacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- duasrodas.NivelAcesso definition

CREATE TABLE `NivelAcesso` (
  `idNivelAcesso` int(11) NOT NULL AUTO_INCREMENT,
  `nivel_acesso` int(11) NOT NULL,
  `nivel_acesso_description` varchar(45) NOT NULL,
  PRIMARY KEY (`idNivelAcesso`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


-- duasrodas.Prioridade definition

CREATE TABLE `Prioridade` (
  `idPrioridade` int(11) NOT NULL AUTO_INCREMENT,
  `descricaoPrioridade` varchar(45) DEFAULT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idPrioridade`),
  UNIQUE KEY `idPrioridade_UNIQUE` (`idPrioridade`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


-- duasrodas.Setor definition

CREATE TABLE `Setor` (
  `idSetor` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idSetor`),
  UNIQUE KEY `idSetor_UNIQUE` (`idSetor`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;


-- duasrodas.Sintomas definition

CREATE TABLE `Sintomas` (
  `idSintomas` int(11) NOT NULL AUTO_INCREMENT,
  `descricaoSintomas` varchar(250) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idSintomas`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;


-- duasrodas.Status definition

CREATE TABLE `Status` (
  `idStatus` int(11) NOT NULL AUTO_INCREMENT,
  `tipoStatus` varchar(45) DEFAULT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idStatus`),
  UNIQUE KEY `idStatus_UNIQUE` (`idStatus`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


-- duasrodas.operacao definition

CREATE TABLE `operacao` (
  `idoperacao` int(11) NOT NULL AUTO_INCREMENT,
  `descricao_operacao` varchar(260) NOT NULL,
  `material` varchar(160) DEFAULT NULL,
  `quantidade_material` double DEFAULT NULL,
  `unidade_material` varchar(50) DEFAULT NULL,
  `tempo_planejado` time DEFAULT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idoperacao`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;


-- duasrodas.tipoManutencao definition

CREATE TABLE `tipoManutencao` (
  `idtipoManutencao` int(11) NOT NULL AUTO_INCREMENT,
  `tipoManutencao` varchar(45) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idtipoManutencao`),
  UNIQUE KEY `tipoManutencao_UNIQUE` (`tipoManutencao`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;


-- duasrodas.Equipamento definition

CREATE TABLE `Equipamento` (
  `idEquipamento` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(150) NOT NULL,
  `equipamento` varchar(120) NOT NULL,
  `equipamentoSuperior` varchar(100) NOT NULL,
  `Setor_idSetor` int(11) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idEquipamento`),
  UNIQUE KEY `idEquipamento_UNIQUE` (`idEquipamento`),
  KEY `fk_Equipamento_Setor1_idx` (`Setor_idSetor`),
  CONSTRAINT `fk_Equipamento_Setor1` FOREIGN KEY (`Setor_idSetor`) REFERENCES `Setor` (`idSetor`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=ujis;


-- duasrodas.Operacoes definition

CREATE TABLE `Operacoes` (
  `id_operacoes` int(11) NOT NULL AUTO_INCREMENT,
  `Operacao` int(11) NOT NULL,
  `Lista_operacao` int(11) DEFAULT NULL,
  `sequencia_operacao` varchar(100) NOT NULL,
  PRIMARY KEY (`id_operacoes`),
  KEY `Operacoes_FK_1` (`Operacao`),
  KEY `Operacoes_FK_3` (`Lista_operacao`),
  CONSTRAINT `Operacoes_FK_1` FOREIGN KEY (`Operacao`) REFERENCES `operacao` (`idoperacao`),
  CONSTRAINT `Operacoes_FK_3` FOREIGN KEY (`Lista_operacao`) REFERENCES `Lista_operacao` (`id_lista_operacao`)
) ENGINE=InnoDB AUTO_INCREMENT=1215 DEFAULT CHARSET=utf8;


-- duasrodas.Usuario definition

CREATE TABLE `Usuario` (
  `idUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `numeroCracha` varchar(45) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `senha` varchar(160) NOT NULL,
  `email` varchar(70) DEFAULT NULL,
  `funcao` varchar(120) NOT NULL,
  `nivel_acesso` int(11) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `numeroCracha_UNIQUE` (`numeroCracha`),
  KEY `fk_nivel_acesso_idx` (`nivel_acesso`),
  CONSTRAINT `Usuario_FK` FOREIGN KEY (`nivel_acesso`) REFERENCES `NivelAcesso` (`idNivelAcesso`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;


-- duasrodas.ordemServico definition

CREATE TABLE `ordemServico` (
  `idOrdemServico` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `resumo` varchar(75) NOT NULL,
  `descricao` varchar(550) DEFAULT NULL,
  `inicioPlanejado` date DEFAULT NULL,
  `fimPlanejado` date DEFAULT NULL,
  `requerParada` tinyint(1) DEFAULT NULL,
  `dataEmissao` date DEFAULT NULL,
  `reporte` int(11) DEFAULT NULL,
  `solicitante` int(11) DEFAULT NULL,
  `tipoManutencao_idtipoManutencao` int(11) NOT NULL,
  `Prioridade_idPrioridade` int(11) NOT NULL,
  `Status_idStatus` int(11) NOT NULL DEFAULT '1',
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idOrdemServico`),
  UNIQUE KEY `idChamado_UNIQUE` (`idOrdemServico`),
  KEY `fk_ordemServico_Prioridade1_idx` (`Prioridade_idPrioridade`),
  KEY `fk_ordemServico_Status1_idx` (`Status_idStatus`),
  KEY `fk_ordemServico_tipoManutencao1_idx` (`tipoManutencao_idtipoManutencao`),
  KEY `ordemServico_FK` (`reporte`),
  KEY `ordemServico_FK_1` (`solicitante`),
  CONSTRAINT `fk_ordemServico_Prioridade1` FOREIGN KEY (`Prioridade_idPrioridade`) REFERENCES `Prioridade` (`idPrioridade`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ordemServico_Status1` FOREIGN KEY (`Status_idStatus`) REFERENCES `Status` (`idStatus`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ordemServico_tipoManutencao1` FOREIGN KEY (`tipoManutencao_idtipoManutencao`) REFERENCES `tipoManutencao` (`idtipoManutencao`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `ordemServico_FK` FOREIGN KEY (`reporte`) REFERENCES `Usuario` (`idUsuario`),
  CONSTRAINT `ordemServico_FK_1` FOREIGN KEY (`solicitante`) REFERENCES `Usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3052 DEFAULT CHARSET=utf8;


-- duasrodas.ordemServico_has_Epi definition

CREATE TABLE `ordemServico_has_Epi` (
  `ordemServico_idOrdemServico` int(11) NOT NULL,
  `Epi_idEpi` int(11) NOT NULL,
  `checked` tinyint(1) NOT NULL DEFAULT '0',
  `justificativa` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ordemServico_idOrdemServico`,`Epi_idEpi`),
  KEY `fk_ordemServico_has_Epi_Epi1_idx` (`Epi_idEpi`),
  KEY `fk_ordemServico_has_Epi_ordemServico1_idx` (`ordemServico_idOrdemServico`),
  CONSTRAINT `fk_ordemServico_has_Epi_Epi1` FOREIGN KEY (`Epi_idEpi`) REFERENCES `Epi` (`idEpi`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ordemServico_has_Epi_ordemServico1` FOREIGN KEY (`ordemServico_idOrdemServico`) REFERENCES `ordemServico` (`idOrdemServico`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- duasrodas.ordemServico_has_Usuario definition

CREATE TABLE `ordemServico_has_Usuario` (
  `ordemServico_idOrdemServico` int(11) NOT NULL,
  `Usuario_idUsuario` int(11) NOT NULL,
  `excluded` tinyint(1) NOT NULL,
  `is_master` tinyint(1) NOT NULL,
  PRIMARY KEY (`ordemServico_idOrdemServico`,`Usuario_idUsuario`),
  KEY `fk_ordemServico_has_Usuario_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_ordemServico_has_Usuario_ordemServico1_idx` (`ordemServico_idOrdemServico`),
  CONSTRAINT `fk_ordemServico_has_Usuario_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ordemServico_has_Usuario_ordemServico1` FOREIGN KEY (`ordemServico_idOrdemServico`) REFERENCES `ordemServico` (`idOrdemServico`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- duasrodas.Apontamento definition

CREATE TABLE `Apontamento` (
  `idApontamento` int(11) NOT NULL AUTO_INCREMENT,
  `data` datetime DEFAULT NULL,
  `descricao_atividade` varchar(150) NOT NULL,
  `tempo` varchar(45) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `sequencia` int(11) DEFAULT NULL,
  `ordemServico_idOrdemServico` int(11) NOT NULL,
  `Usuario_idUsuario` int(11) NOT NULL,
  PRIMARY KEY (`idApontamento`),
  KEY `fk_Apontamento_ordemServico1_idx` (`ordemServico_idOrdemServico`),
  KEY `fk_Apontamento_Usuario1_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Apontamento_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Apontamento_ordemServico1` FOREIGN KEY (`ordemServico_idOrdemServico`) REFERENCES `ordemServico` (`idOrdemServico`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;


-- duasrodas.Componente definition

CREATE TABLE `Componente` (
  `idComponente` int(11) NOT NULL AUTO_INCREMENT,
  `DescricaoComponente` varchar(250) DEFAULT NULL,
  `Equipamento_idEquipamento` int(11) NOT NULL,
  `excluded` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idComponente`),
  KEY `fk_Componente_Equipamento1_idx` (`Equipamento_idEquipamento`),
  CONSTRAINT `fk_Componente_Equipamento1` FOREIGN KEY (`Equipamento_idEquipamento`) REFERENCES `Equipamento` (`idEquipamento`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


-- duasrodas.Equipamentos definition

CREATE TABLE `Equipamentos` (
  `id_equipamentos` int(11) NOT NULL AUTO_INCREMENT,
  `Equipamento` int(11) NOT NULL,
  `Ordem_servico` int(11) NOT NULL,
  `execucao` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_equipamentos`),
  KEY `Equipamentos_FK_equipamento` (`Equipamento`),
  KEY `Equipamentos_FK_ordem_servico` (`Ordem_servico`),
  CONSTRAINT `Equipamentos_FK_equipamento` FOREIGN KEY (`Equipamento`) REFERENCES `Equipamento` (`idEquipamento`),
  CONSTRAINT `Equipamentos_FK_ordem_servico` FOREIGN KEY (`Ordem_servico`) REFERENCES `ordemServico` (`idOrdemServico`)
) ENGINE=InnoDB AUTO_INCREMENT=423 DEFAULT CHARSET=utf8;


-- duasrodas.Locais definition

CREATE TABLE `Locais` (
  `id_locais` int(11) NOT NULL AUTO_INCREMENT,
  `Local` int(11) NOT NULL,
  `Ordem_Servico` int(11) NOT NULL,
  PRIMARY KEY (`id_locais`),
  KEY `Locais_FK` (`Ordem_Servico`),
  KEY `Locais_FK_1` (`Local`),
  CONSTRAINT `Locais_FK` FOREIGN KEY (`Ordem_Servico`) REFERENCES `ordemServico` (`idOrdemServico`),
  CONSTRAINT `Locais_FK_1` FOREIGN KEY (`Local`) REFERENCES `Setor` (`idSetor`)
) ENGINE=InnoDB AUTO_INCREMENT=399 DEFAULT CHARSET=utf8;


-- duasrodas.Token definition

CREATE TABLE `Token` (
  `idToken` int(11) NOT NULL AUTO_INCREMENT,
  `Token` varchar(45) DEFAULT NULL,
  `Status` tinyint(1) DEFAULT NULL,
  `Usuario_idUsuario` int(11) NOT NULL,
  PRIMARY KEY (`idToken`),
  UNIQUE KEY `idToken_UNIQUE` (`idToken`),
  KEY `fk_Token_Usuario1_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Token_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `Usuario` (`idUsuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- duasrodas.Verificacao definition

CREATE TABLE `Verificacao` (
  `idVerificacao` int(11) NOT NULL AUTO_INCREMENT,
  `solucaoRealizada` varchar(700) NOT NULL,
  `dataVerificacao` datetime NOT NULL,
  `problemaResolvido` varchar(45) NOT NULL,
  `ordemServico_idOrdemServico` int(11) NOT NULL,
  `tipoVerificacao` int(11) NOT NULL,
  PRIMARY KEY (`idVerificacao`),
  KEY `fk_Verificacao_ordemServico1_idx` (`ordemServico_idOrdemServico`),
  CONSTRAINT `fk_Verificacao_ordemServico1` FOREIGN KEY (`ordemServico_idOrdemServico`) REFERENCES `ordemServico` (`idOrdemServico`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8;


-- duasrodas.equipamento_operacao definition

CREATE TABLE `equipamento_operacao` (
  `id_equipamento_operacao` int(11) NOT NULL AUTO_INCREMENT,
  `Equipamento_FK` int(11) NOT NULL,
  `Operacao_FK` int(11) DEFAULT NULL,
  `Locais_FK` int(11) NOT NULL,
  `execucao` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_equipamento_operacao`),
  KEY `equipamento_operacao_FK` (`Equipamento_FK`),
  KEY `equipamento_operacao_FK_2` (`Locais_FK`),
  KEY `equipamento_operacao_FK_1` (`Operacao_FK`),
  CONSTRAINT `equipamento_operacao_FK` FOREIGN KEY (`Equipamento_FK`) REFERENCES `Equipamentos` (`id_equipamentos`),
  CONSTRAINT `equipamento_operacao_FK_1` FOREIGN KEY (`Operacao_FK`) REFERENCES `Operacoes` (`id_operacoes`),
  CONSTRAINT `equipamento_operacao_FK_2` FOREIGN KEY (`Locais_FK`) REFERENCES `Locais` (`id_locais`)
) ENGINE=InnoDB AUTO_INCREMENT=909 DEFAULT CHARSET=utf8;