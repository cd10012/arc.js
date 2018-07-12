"use strict";
import { Address, Hash } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ArcTransactionDataResult, IContractWrapperFactory } from "../iContractWrapperBase";

import BigNumber from "bignumber.js";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";

export class TokenCapGCWrapper extends ContractWrapperBase {
  public name: string = "TokenCapGC";
  public friendlyName: string = "Token Cap Global Constraint";
  public factory: IContractWrapperFactory<TokenCapGCWrapper> = TokenCapGCFactory;

  public async setParameters(params: TokenCapGcParams): Promise<ArcTransactionDataResult<Hash>> {

    if (!params.token) {
      throw new Error("token must be set");
    }
    const cap = new BigNumber(params.cap);

    if (cap.lt(0)) {
      throw new Error("cap must be greater than or equal to zero");
    }

    return super._setParameters(
      "TokenCapGC.setParameters",
      params.txEventContext,
      params.token,
      cap);
  }

  public async getParameters(paramsHash: Hash): Promise<any> {
    const params = await this.getParametersArray(paramsHash);
    return {
      cap: params[1],
      token: params[0],
    };
  }

  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controller = await this.getController(avatarAddress);
    return controller.getGlobalConstraintParameters(this.address, avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GetTokenCapGcParamsResult> {
    return this._getSchemeParameters(avatarAddress);
  }
}

export const TokenCapGCFactory =
  new ContractWrapperFactory("TokenCapGC", TokenCapGCWrapper, new Web3EventService());

export interface TokenCapGcParams extends TxGeneratingFunctionOptions {
  cap: BigNumber | string;
  token: Address;
}

export interface GetTokenCapGcParamsResult {
  cap: BigNumber;
  token: Address;
}